import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, GripVertical, Layers3, ShieldCheck, SlidersHorizontal, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { product } from '../config/product';
gsap.registerPlugin(ScrollTrigger);

export function Progress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  return <motion.div className="reading-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} aria-hidden="true"/>;
}

export function TextReveal({children}: {children: ReactNode}) {
  const reduced = useReducedMotion();
  return <span className="text-mask"><motion.span initial={reduced ? false : {y:'105%'}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:.65,ease:[.22,1,.36,1]}}>{children}</motion.span></span>;
}

export function ScrollCue() {
  return <a className="scroll-cue" href="#comparacao"><span className="scroll-cue-icon"><ArrowDown size={15}/></span>EXPLORE O KIT</a>;
}

export const demos = [
  { file:'coffee', label:'Cafeterias', category:'Produto', title:'Uma pausa. Um bom café.', color:'#c1ad8e' },
  { file:'fashion', label:'Moda', category:'Coleção', title:'O básico com personalidade.', color:'#d9dcd0' },
  { file:'sale', label:'Promoções', category:'Oferta', title:'Dê destaque à sua oferta.', color:'#ff6a00' },
  { file:'service', label:'Serviços', category:'Apresentação', title:'Seu trabalho em evidência.', color:'#c2c8b4' },
  { file:'barber', label:'Barbearias', category:'Agenda', title:'Seu estilo, seu horário.', color:'#cbb99c' },
  { file:'studio', label:'Autônomos', category:'Portfólio', title:'Boas ideias ganham forma.', color:'#bdb3d7' },
];

export function DemoImage({index, className='', eager=false}:{index:number;className?:string;eager?:boolean}) {
  const demo=demos[index%demos.length];
  return <img className={`demo-image ${className}`} src={`/templates/${demo.file}.svg`} width="480" height="600" loading={eager?'eager':'lazy'} alt={`Modelo ilustrativo para ${demo.label}: ${demo.title}`}/>;
}

export function Comparison() {
  const [position,setPosition]=useState(52);
  const [scene,setScene]=useState(0);
  const [interacted,setInteracted]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    if(reduced || interacted || !root.current)return;
    let frame=0; let started=false;
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting||started)return;started=true;
      const start=performance.now();
      const tick=(now:number)=>{const p=Math.min((now-start)/1400,1);setPosition(52+23*Math.sin(p*Math.PI*2)*(1-p));if(p<1)frame=requestAnimationFrame(tick);};
      frame=requestAnimationFrame(tick);
    },{threshold:.4});observer.observe(root.current);
    return()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[reduced,interacted]);
  const titles=['Um café para acompanhar seu dia.','Nova coleção disponível.','Sua próxima promoção começa aqui.'];
  return <section id="comparacao" className="section comparison-section"><div className="container comparison-layout"><div className="comparison-copy"><span className="eyebrow">01 / VEJA A DIFERENÇA NO DESIGN</span><h2><TextReveal>A mesma ideia.</TextReveal><TextReveal><em>Outra apresentação.</em></TextReveal></h2><p>Texto, imagem e informação precisam trabalhar juntos. Arraste a divisão e veja como uma composição com hierarquia muda a leitura da publicação.</p><div className="scene-tabs" role="group" aria-label="Escolha um exemplo">{['Cafeteria','Moda','Promoção'].map((name,i)=><button key={name} aria-pressed={scene===i} onClick={()=>{setScene(i);setInteracted(true);}}>{name}</button>)}</div><div className="comparison-notes"><span><Check size={15}/>Uma mensagem principal em destaque</span><span><Check size={15}/>Cores e tipografia com consistência</span><span><Check size={15}/>Uma composição pronta para personalizar</span></div><p className="honest-note">Comparação de composição visual. Não representa resultado de cliente.</p></div><div ref={root} className="comparison-frame"><div className="comparison-toolbar"><span>ESTUDO DE COMPOSIÇÃO</span><SlidersHorizontal size={16}/></div><div className="comparison-canvas"><div className="compare-layer compare-before"><div className="plain-post"><span>SUA MARCA</span><div className={`plain-object plain-object-${scene}`}/><b>{titles[scene]}</b><small>Saiba mais. Entre em contato.</small></div></div><div className="compare-layer compare-after" style={{clipPath:`inset(0 0 0 ${position}%)`}}><DemoImage index={scene}/></div><span className="compare-label before-label">ANTES</span><span className="compare-label after-label">DEPOIS</span><div className="compare-divider" style={{left:`${position}%`}}><span><ChevronLeft size={14}/><GripVertical size={16}/><ChevronRight size={14}/></span></div><input className="comparison-range" type="range" min="0" max="100" value={position} aria-label="Comparar publicação antes e depois" aria-valuetext={`${Math.round(position)}% antes, ${Math.round(100-position)}% depois`} onPointerDown={()=>setInteracted(true)} onKeyDown={()=>setInteracted(true)} onChange={e=>{setInteracted(true);setPosition(Number(e.target.value));}}/></div><div className="comparison-hint"><ArrowLeft size={13}/> ARRASTE PARA COMPARAR <ArrowRight size={13}/></div></div></div></section>;
}

export function ProductShowcase() {
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!root.current)return;
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.fromTo('.showcase-tile',{y:80,rotateX:10,opacity:0},{y:0,rotateX:0,opacity:1,duration:.85,stagger:.09,ease:'power3.out',scrollTrigger:{trigger:root.current,start:'top 80%',once:true}});
        if(window.matchMedia('(min-width: 900px)').matches){
          gsap.to('.showcase-column:nth-child(odd)',{y:-35,ease:'none',scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:1}});
          gsap.to('.showcase-column:nth-child(even)',{y:35,ease:'none',scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:1}});
        }
      },root);
      return()=>ctx.revert();
    });return()=>media.revert();
  },[]);
  return <section ref={root} className="section showcase-section" id="vitrine"><div className="container"><div className="showcase-heading"><span className="eyebrow">02 / UMA BIBLIOTECA PARA O SEU CONTEÚDO</span><h2><TextReveal>100 modelos.</TextReveal><TextReveal><em>Inúmeras possibilidades.</em></TextReveal></h2><p>Um produto para apresentar. Um serviço para explicar. Uma novidade para divulgar. Comece pela ocasião e encontre uma direção visual.</p></div><div className="template-wall">{[0,1,2].map(col=><div className="showcase-column" key={col}>{[col,col+3].map((index)=><div className="showcase-tile" key={index}><DemoImage index={index}/><span>{String(index+1).padStart(2,'0')} / {demos[index].label}</span></div>)}</div>)}</div><p className="honest-note wall-note">Composições de apresentação para diferentes tipos de negócio. Confira os arquivos incluídos nos detalhes do produto.</p><div className="showcase-bottom"><Layers3 size={22}/><p><b>Um ponto de partida. A sua identidade.</b><span>Troque a mensagem, ajuste as cores e escolha a imagem do seu negócio.</span></p><a href="#beneficios">VEJA NA PRÁTICA <ArrowDown size={15}/></a></div></div></section>;
}

export function Benefits() {
  const [tone,setTone]=useState('#ff6a00');
  const [message,setMessage]=useState('Sua próxima novidade.');
  const [category,setCategory]=useState(0);
  return <section className="section container benefits-story" id="beneficios"><div className="section-intro"><span className="eyebrow">03 / DA TELA EM BRANCO AO SEU POST</span><h2>Por que esse kit<br/><em>facilita sua rotina?</em></h2></div><article className="benefit-row"><div className="benefit-text"><span className="benefit-number">01</span><h3>Menos tempo<br/>decidindo por onde começar.</h3><p>Uma composição pronta organiza o título, a imagem e a chamada. Você concentra a atenção na mensagem que quer divulgar.</p><span className="benefit-tag">UM PONTO DE PARTIDA VISUAL</span></div><div className="layout-demo" aria-label="Demonstração animada de composição"><span className="canvas-label">DO RASCUNHO À COMPOSIÇÃO</span><div className="layout-pieces"><span className="piece piece-title">Sua mensagem<br/><b>em destaque.</b></span><span className="piece piece-image"><span/></span><span className="piece piece-footer">SUA MARCA <ArrowRight size={14}/></span></div><span className="mini-label">TEXTO + IMAGEM + HIERARQUIA</span></div></article><article className="benefit-row reverse"><div className="benefit-text"><span className="benefit-number">02</span><h3>Um feed que<br/>parece da mesma marca.</h3><p>Repita a paleta, o estilo dos títulos e os detalhes da composição. Diferentes publicações podem conversar entre si.</p><span className="benefit-tag">CONSISTÊNCIA SEM COMEÇAR DO ZERO</span></div><div className="feed-demo"><div className="feed-profile"><span>m.</span><div><b>sua.marca</b><small>Um negócio com personalidade.</small></div></div><div className="feed-grid">{[0,2,3,2,3,0,3,0,2].map((i,k)=><div key={k}><DemoImage index={i}/></div>)}</div><span className="mini-label">COMPOSIÇÃO DE IDENTIDADE VISUAL</span></div></article><article className="benefit-row"><div className="benefit-text"><span className="benefit-number">03</span><h3>O modelo é o começo.<br/>O resultado tem a sua cara.</h3><p>Experimente mudar a cor e o título ao lado. Veja como os elementos de uma publicação podem receber a identidade do seu negócio.</p><span className="benefit-tag">EXPERIMENTE A PERSONALIZAÇÃO</span></div><div className="editor-demo"><div className="editor-preview" style={{background:tone}}><span>SUA MARCA / ESTÚDIO</span><b>{message || 'Sua próxima novidade.'}</b><div className="editor-flower" aria-hidden="true">✳</div><small>FEITO DO SEU JEITO. <ArrowRight size={18}/></small></div><div className="editor-controls"><span className="canvas-label">EXPERIMENTE UMA COR</span><div className="swatches">{['#ff6a00','#c1c9b3','#b8a6df','#d4bd96'].map(color=><button key={color} style={{background:color}} aria-label={`Usar cor ${color}`} aria-pressed={tone===color} onClick={()=>setTone(color)}>{tone===color&&<Check size={15}/>}</button>)}</div><label htmlFor="demo-title">Seu título</label><input id="demo-title" maxLength={42} value={message} onChange={e=>setMessage(e.target.value)}/><small>Experimente a composição aqui. Confira a ferramenta de edição nos requisitos do produto.</small></div></div></article><article className="benefit-row reverse"><div className="benefit-text"><span className="benefit-number">04</span><h3>Uma ocasião diferente.<br/>Uma nova direção visual.</h3><p>Apresente um produto, explique um serviço ou anuncie uma promoção. Escolha o objetivo da publicação antes de personalizar.</p><span className="benefit-tag">MODELOS PARA A ROTINA DO NEGÓCIO</span></div><div className="occasion-demo"><div className="scene-tabs" role="group" aria-label="Objetivo da publicação">{['Produtos','Serviços','Promoções'].map((text,i)=><button key={text} aria-pressed={category===i} onClick={()=>setCategory(i)}>{text}</button>)}</div><motion.div key={category} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{duration:.25}}><DemoImage index={[1,3,2][category]}/></motion.div></div></article></section>;
}

export function ReviewsOrGallery() {
  const list=useRef<HTMLDivElement>(null);
  const [page,setPage]=useState(0);
  const real=product.reviews.length>0;
  const total=real?product.reviews.length:demos.length;
  const [limit,setLimit]=useState(total-1);
  useEffect(()=>{
    const el=list.current;if(!el)return;
    const measure=()=>{const card=el.firstElementChild as HTMLElement|null; if(!card)return;const step=card.offsetWidth+20;setLimit(Math.max(0,total-Math.max(1,Math.round(el.clientWidth/step))));setPage(Math.round(el.scrollLeft/step));};
    const ro=new ResizeObserver(measure);ro.observe(el);measure();return()=>ro.disconnect();
  },[total]);
  function move(direction:number){const el=list.current;const card=el?.firstElementChild as HTMLElement|null;if(!el||!card)return;el.scrollBy({left:direction*(card.offsetWidth+20),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  return <section className="section gallery-section"><div className="container"><div className="gallery-title"><div><span className="eyebrow">04 / {real?'EXPERIÊNCIAS REAIS':'CONHEÇA AS POSSIBILIDADES'}</span><h2>{real?<>Veja o que os<br/><em>clientes estão dizendo.</em></>:<>O design muda.<br/><em>A ideia continua sua.</em></>}</h2></div><div className="carousel-controls"><button aria-label="Exemplo anterior" disabled={page<=0} onClick={()=>move(-1)}><ArrowLeft size={19}/></button><button aria-label="Próximo exemplo" disabled={page>=limit} onClick={()=>move(1)}><ArrowRight size={19}/></button></div></div><div ref={list} className={`demo-carousel ${real?'review-carousel':''}`} tabIndex={0} role="region" aria-label={real?'Avaliações de clientes':'Galeria de composições visuais'} onScroll={()=>{const el=list.current;const card=el?.firstElementChild as HTMLElement|null;if(el&&card)setPage(Math.round(el.scrollLeft/(card.offsetWidth+20)));}}>{real?product.reviews.map((review,i)=><article className="review" key={`${review.name}-${i}`}><div className="review-author">{review.avatar?<img src={review.avatar} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none';}}/>:<span>{review.name.slice(0,1)}</span>}<div><b>{review.name}</b><time dateTime={review.date}>{new Date(`${review.date}T12:00:00`).toLocaleDateString('pt-BR')}</time></div></div><div className="review-stars" aria-label={`${review.rating} de 5 estrelas`}>{Array.from({length:5},(_,j)=><Star key={j} size={15} fill={j<review.rating?'currentColor':'none'}/>)}</div><p>{review.text}</p>{review.verifiedPurchase&&<small className="verified"><ShieldCheck size={14}/>Compra verificada</small>}</article>):demos.map((demo,i)=><article className="demo-slide" key={demo.file}><div className="slide-image"><DemoImage index={i}/><span>ESTUDO {String(i+1).padStart(2,'0')}</span></div><div className="slide-meta"><div><span>{demo.category}</span><h3>{demo.label}</h3></div><a href="#oferta" aria-label={`Conhecer a oferta para ${demo.label}`}><ArrowRight size={19}/></a></div></article>)}</div><div className="carousel-footer"><span>{String(page+1).padStart(2,'0')} <i>/ {String(limit+1).padStart(2,'0')}</i></span><p>{real?'Relatos publicados conforme fornecidos pelo responsável.':'Referências visuais de composição e estilo para diferentes negócios.'}</p><span>DESLIZE PARA EXPLORAR <ArrowRight size={13}/></span></div></div></section>;
}

export function Guarantee() {
  const configured=Boolean(product.guarantee.period&&product.guarantee.conditions&&product.guarantee.requestInstructions);
  if(!configured) return null;
  return <section className="container guarantee-section"><div className="guarantee-symbol"><ShieldCheck size={45}/></div><div><span className="eyebrow">CLAREZA EM CADA ETAPA</span><h2>{configured?'Conheça a política de reembolso.':'Antes de comprar, todos os detalhes.'}</h2><p>{configured?product.guarantee.conditions:'A política de reembolso será publicada antes da abertura das vendas. Prazo, condições e canal de atendimento precisam estar claros para você decidir.'}</p>{configured&&<dl><dt>Prazo</dt><dd>{product.guarantee.period}</dd><dt>Como solicitar</dt><dd>{product.guarantee.requestInstructions}</dd></dl>}<a href="#duvidas">CONSULTE AS DÚVIDAS FREQUENTES <ArrowRight size={15}/></a></div></section>;
}
