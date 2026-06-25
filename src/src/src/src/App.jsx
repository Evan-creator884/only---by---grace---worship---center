import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import LOGO from './logo.js'

const FB_PAGE = 'https://www.facebook.com/profile.php?id=100069916947133'
const MAPS_URL = 'https://maps.app.goo.gl/WX58CzZVNEadpcScA'
const EMAIL = 'vwykcf@icloud.com'
const PHONE = '+264 85 127 1319'

const VIDEOS = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    platform: 'facebook',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100069916947133&show_text=false&width=560',
    description: 'Join us every Sunday at 9:00 AM for powerful worship and the Word.'
  },
  {
    id: 2,
    title: 'Watch Our Latest Sermon',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLbpi6ZahtOH6Ar_3GPy3workbible',
    description: 'Messages from Pastor Colin Van Wyk — teaching the Word of God.'
  },
  {
    id: 3,
    title: 'Bible Study & Prayer',
    platform: 'facebook',
    embedUrl: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100069916947133&tabs=videos&width=340&height=500&small_header=false&adapt_container_width=true',
    description: 'Wednesday night Bible study and prayer sessions streamed live.'
  }
]

const fadeUp = { hidden:{opacity:0,y:30}, show:{opacity:1,y:0,transition:{duration:0.7,ease:[0.25,0.46,0.45,0.94]}} }
const stagger = { show:{transition:{staggerChildren:0.12}} }
const fadeIn = { hidden:{opacity:0}, show:{opacity:1,transition:{duration:0.6}} }

function VideoCard3D({ video }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y,[-0.5,0.5],[10,-10]),{stiffness:300,damping:30})
  const rotateY = useSpring(useTransform(x,[-0.5,0.5],[-10,10]),{stiffness:300,damping:30})
  const glowX = useTransform(x,[-0.5,0.5],[0,100])
  const glowY = useTransform(y,[-0.5,0.5],[0,100])

  function onMouseMove(e) {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX-r.left)/r.width-0.5)
    y.set((e.clientY-r.top)/r.height-0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0); setHovered(false) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{ perspective:900, transformStyle:'preserve-3d' }}
      whileHover={{ scale:1.03 }}
      initial={{ opacity:0, y:40 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ duration:0.6 }}
    >
      <motion.div
        style={{
          rotateX, rotateY, transformStyle:'preserve-3d',
          borderRadius:20,
          background:'linear-gradient(145deg,#12122a,#3d0070)',
          border:'1px solid rgba(196,181,253,0.2)',
          overflow:'hidden',
          boxShadow: hovered
            ? '0 30px 80px rgba(107,33,168,0.5), 0 0 0 1px rgba(196,181,253,0.3)'
            : '0 12px 40px rgba(107,33,168,0.2)',
          transition:'box-shadow 0.3s',
          position:'relative',
        }}
      >
        <motion.div style={{
          position:'absolute',inset:0,zIndex:10,pointerEvents:'none',borderRadius:20,
          background: hovered
            ? `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, rgba(245,200,66,0.08) 0%, transparent 60%)`
            : 'transparent',
          transition:'background 0.15s',
        }}/>

        <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden'}}>
          {playing ? (
            <iframe
              src={video.platform === 'youtube'
                ? video.embedUrl + '&autoplay=1'
                : video.embedUrl + '&autoplay=true'}
              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <div
              onClick={()=>setPlaying(true)}
              style={{
                position:'absolute',inset:0,cursor:'pointer',
                background:'linear-gradient(145deg,#1a0040,#3d0070)',
                display:'flex',alignItems:'center',justifyContent:'center',
                flexDirection:'column',gap:16,
              }}
            >
              <div style={{
                position:'absolute',top:12,left:12,
                background: video.platform==='youtube' ? '#FF0000' : '#1877F2',
                color:'white',fontSize:'0.7rem',fontWeight:700,
                padding:'4px 10px',borderRadius:20,letterSpacing:'0.06em',textTransform:'uppercase',
              }}>
                {video.platform === 'youtube' ? '▶ YouTube' : 'f Facebook'}
              </div>

              <motion.div
                whileHover={{scale:1.15}}
                style={{
                  width:72,height:72,borderRadius:'50%',
                  background:'rgba(245,200,66,0.15)',border:'2px solid rgba(245,200,66,0.5)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  boxShadow:'0 0 40px rgba(245,200,66,0.2)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5C842">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </motion.div>
              <span style={{color:'rgba(255,255,255,0.5)',fontSize:'0.82rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Click to Play</span>
            </div>
          )}
        </div>

        <div style={{padding:'22px 24px',position:'relative',zIndex:5}}>
          <div style={{
            fontSize:'0.72rem',letterSpacing:'0.14em',textTransform:'uppercase',
            color:'#C4B5FD',fontWeight:700,marginBottom:8,
          }}>
            {video.platform === 'youtube' ? 'YouTube' : 'Facebook Live'}
          </div>
          <h3 style={{fontFamily:"'Cinzel',serif",fontSize:'1.1rem',color:'white',marginBottom:8,lineHeight:1.3}}>
            {video.title}
          </h3>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:'0.88rem',lineHeight:1.6,marginBottom:16}}>
            {video.description}
          </p>
          
            href={video.platform==='facebook' ? FB_PAGE : '#'}
            target="_blank"
            rel="noopener"
            style={{
              display:'inline-flex',alignItems:'center',gap:6,
              color:'#F5C842',fontSize:'0.82rem',fontWeight:700,
              letterSpacing:'0.06em',textTransform:'uppercase',
            }}
          >
            Watch on {video.platform==='youtube'?'YouTube':'Facebook'} →
          </a>
        </div>

        <div style={{
          position:'absolute',inset:0,borderRadius:20,
          background:'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 50%)',
          pointerEvents:'none',
        }}/>
      </motion.div>
    </motion.div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>20)
    window.addEventListener('scroll',h)
    return()=>window.removeEventListener('scroll',h)
  },[])
  const links=[['#about','About'],['#times','Services'],['#sermons','Sermons'],['#members','Members'],['#contact','Contact']]

  return (
    <motion.header
      initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6}}
      style={{
        position:'sticky',top:0,zIndex:200,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
        backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(107,33,168,0.1)',
        boxShadow: scrolled ? '0 4px 24px rgba(107,33,168,0.1)' : 'none',
        transition:'all 0.3s',
      }}
    >
      <div style={{maxWidth:1140,margin:'0 auto',padding:'0 28px',display:'flex',alignItems:'center',justifyContent:'space-between',height:68}}>
        <a href="#top" style={{display:'flex',alignItems:'center',gap:12}}>
          <img src={LOGO} alt="Logo" style={{width:42,height:42,objectFit:'contain',borderRadius:10,boxShadow:'0 2px 12px rgba(107,33,168,0.2)'}}/>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:'0.88rem',color:'#3d0070',letterSpacing:'0.05em'}}>Only By Grace</div>
            <div style={{fontSize:'0.6rem',fontWeight:500,color:'#6B21A8',letterSpacing:'0.12em',textTransform:'uppercase'}}>Worship Center · Namibia</div>
          </div>
        </a>

        <nav style={{display:'flex',alignItems:'center',gap:4,flexWrap:'nowrap'}} className="desktop-nav">
          {links.map(([href,label])=>(
            <motion.a key={href} href={href} whileHover={{color:'#6B21A8',background:'#EDE9FE'}}
              style={{color:'#52525b',padding:'7px 13px',borderRadius:8,fontWeight:500,fontSize:'0.88rem',transition:'all 0.2s'}}
              onClick={()=>setOpen(false)}
            >{label}</motion.a>
          ))}
          <motion.a href="#donate" whileHover={{background:'#3d0070',scale:1.02}}
            style={{background:'#6B21A8',color:'white',fontWeight:700,padding:'9px 20px',borderRadius:30,fontSize:'0.85rem',marginLeft:8}}
          >Donate</motion.a>
        </nav>

        <button onClick={()=>setOpen(!open)} style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:8}} className="mobile-toggle" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2">
            {open ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 6h18M3 12h18M3 18h18"/>}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            style={{background:'white',padding:'12px 20px 20px',borderBottom:'1px solid #EDE9FE',boxShadow:'0 12px 40px rgba(107,33,168,0.12)'}}
          >
            {links.map(([href,label])=>(
              <motion.a key={href} href={href} whileHover={{color:'#6B21A8',paddingLeft:20}}
                onClick={()=>setOpen(false)}
                style={{display:'block',padding:'12px 16px',color:'#52525b',fontWeight:500,borderRadius:10,transition:'all 0.2s'}}
              >{label}</motion.a>
            ))}
            <a href="#donate" onClick={()=>setOpen(false)}
              style={{display:'block',marginTop:8,textAlign:'center',background:'#6B21A8',color:'white',padding:'13px',borderRadius:30,fontWeight:700}}
            >Donate</a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:900px){.desktop-nav{display:none!important}.mobile-toggle{display:flex!important}}
      `}</style>
    </motion.header>
  )
}

function Hero() {
  const heroRef = useRef(null)
  const glowX = useMotionValue('50%')
  const glowY = useMotionValue('50%')

  function onMouseMove(e) {
    const r = heroRef.current.getBoundingClientRect()
    glowX.set(((e.clientX-r.left)/r.width*100)+'%')
    glowY.set(((e.clientY-r.top)/r.height*100)+'%')
  }

  return (
    <section ref={heroRef} onMouseMove={onMouseMove} id="top" style={{
      position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',background:'#080818',
      overflow:'hidden',padding:'100px 28px 80px',textAlign:'center',
    }}>
      <div style={{
        position:'absolute',inset:0,
        backgroundImage:'linear-gradient(rgba(107,33,168,0.13) 1px,transparent 1px),linear-gradient(90deg,rgba(107,33,168,0.13) 1px,transparent 1px)',
        backgroundSize:'60px 60px',
        maskImage:'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
        WebkitMaskImage:'radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%)',
      }}/>

      {[
        {w:500,h:500,t:'-100px',r:'-100px',c:'rgba(107,33,168,0.25)'},
        {w:400,h:400,b:'-80px',l:'-80px',c:'rgba(245,200,66,0.1)'},
        {w:280,h:280,t:'40%',l:'5%',c:'rgba(124,58,237,0.18)'},
      ].map((o,i)=>(
        <motion.div key={i}
          animate={{x:[0,20,0],y:[0,15,0]}}
          transition={{duration:10+i*2,repeat:Infinity,ease:'easeInOut'}}
          style={{
            position:'absolute',width:o.w,height:o.h,borderRadius:'50%',
            background:`radial-gradient(circle,${o.c},transparent 70%)`,
            filter:'blur(60px)',pointerEvents:'none',
            top:o.t,right:o.r,bottom:o.b,left:o.l,
          }}
        />
      ))}

      <motion.div style={{
        position:'absolute',width:600,height:600,borderRadius:'50%',
        background:'radial-gradient(circle,rgba(107,33,168,0.22) 0%,transparent 70%)',
        pointerEvents:'none',transform:'translate(-50%,-50%)',
        left:glowX,top:glowY,
        transition:'left 0.12s ease,top 0.12s ease',
      }}/>

      <div style={{position:'relative',zIndex:10,maxWidth:900,width:'100%'}}>
        <motion.div
          initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{duration:0.8,type:'spring',stiffness:200}}
          style={{display:'inline-block',marginBottom:32,position:'relative'}}
        >
          <motion.div
            animate={{opacity:[0.5,1,0.5],scale:[1,1.04,1]}}
            transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}
            style={{position:'absolute',inset:-10,borderRadius:32,border:'1px solid rgba(196,181,253,0.3)'}}
          />
          <img src={LOGO} alt="Only By Grace Worship Center"
            style={{width:110,height:110,objectFit:'contain',borderRadius:22,
              background:'rgba(255,255,255,0.07)',padding:12,
              border:'1px solid rgba(255,255,255,0.15)',
              boxShadow:'0 0 0 8px rgba(107,33,168,0.12),0 16px 60px rgba(107,33,168,0.5)'
            }}
          />
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.6}}
          style={{display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(107,33,168,0.2)',border:'1px solid rgba(196,181,253,0.3)',
            color:'#C4B5FD',fontSize:'0.78rem',letterSpacing:'0.1em',textTransform:'uppercase',
            padding:'7px 18px',borderRadius:30,marginBottom:28,fontWeight:600,
            backdropFilter:'blur(8px)',
          }}
        >
          <motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:2,repeat:Infinity}}
            style={{width:6,height:6,borderRadius:'50%',background:'#F5C842',display:'inline-block'}}
          />
          Rehoboth, Namibia · Isaiah 62:10
        </motion.div>

        <motion.h1
          variants={stagger} initial="hidden" animate="show"
          style={{fontFamily:"'Cinzel',serif",fontWeight:900,lineHeight:0.95,
            marginBottom:8,display:'flex',flexDirection:'column',alignItems:'center',gap:4,
          }}
        >
          <motion.span variants={fadeUp}
            style={{fontSize:'clamp(1rem,3vw,1.6rem)',color:'rgba(255,255,255,0.7)',
              letterSpacing:'0.5em',fontWeight:400}}
          >ONLY</motion.span>
          <motion.span variants={fadeUp}
            style={{fontSize:'clamp(1rem,2.5vw,1.3rem)',color:'rgba(255,255,255,0.4)',
              letterSpacing:'0.7em',fontWeight:400}}
          >BY</motion.span>
          <motion.span variants={fadeUp}
            style={{
              fontSize:'clamp(4rem,11vw,8rem)',
              background:'linear-gradient(135deg,#FDE68A 0%,#F5C842 30%,#fff8d0 50%,#F5C842 70%,#FDE68A 100%)',
              backgroundSize:'300% 300%',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
              filter:'drop-shadow(0 0 30px rgba(245,200,66,0.5))',
              animation:'goldShimmer 4s ease infinite',
            }}
          >GRACE</motion.span>
          <motion.span variants={fadeUp}
            style={{fontSize:'clamp(0.9rem,2.5vw,1.3rem)',color:'rgba(255,255,255,0.6)',
              letterSpacing:'0.35em',fontWeight:400,
              borderTop:'1px solid rgba(196,181,253,0.2)',paddingTop:16,marginTop:8,
              width:'100%',textAlign:'center',
            }}
          >WORSHIP CENTER</motion.span>
        </motion.h1>

        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1,duration:0.7}}
          style={{fontSize:'clamp(1rem,2vw,1.15rem)',color:'rgba(255,255,255,0.5)',
            maxWidth:520,margin:'24px auto 40px',
          }}
        >
          Spreading the Holy Gospel of Jesus Christ · Making Disciples of All Nations · Rehoboth, Namibia
        </motion.p>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:0.7}}
          style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}
        >
          {[
            {href:'#times',label:'Plan Your Visit',style:{background:'linear-gradient(135deg,#F5C842,#e8b800)',color:'#1a0a00',boxShadow:'0 4px 20px rgba(245,200,66,0.35)'}},
            {href:'#members',label:'Join Our Family',style:{background:'rgba(255,255,255,0.06)',color:'white',border:'1px solid rgba(255,255,255,0.2)'}},
            {href:'#donate',label:'Donate',style:{background:'rgba(255,255,255,0.06)',color:'white',border:'1px solid rgba(255,255,255,0.2)'}},
          ].map(b=>(
            <motion.a key={b.label} href={b.href} whileHover={{scale:1.05,y:-2}} whileTap={{scale:0.97}}
              style={{fontWeight:700,fontSize:'0.95rem',padding:'13px 28px',borderRadius:30,
                display:'inline-flex',alignItems:'center',gap:8,cursor:'pointer',...b.style}}
            >{b.label}</motion.a>
          ))}
        </motion.div>

        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.5,duration:0.7}}
          style={{display:'flex',marginTop:56,borderRadius:16,overflow:'hidden',
            border:'1px solid rgba(196,181,253,0.15)',background:'rgba(255,255,255,0.04)',
            backdropFilter:'blur(12px)',
          }}
        >
          {[
            {n:'4',l:'Weekly Services'},{n:'Matt',l:'28:19'},{n:'Isa',l:'62:10'},{n:'NAM',l:'Rehoboth'},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,padding:'18px 16px',textAlign:'center',
              borderRight: i<3 ? '1px solid rgba(196,181,253,0.12)' : 'none',
            }}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:'1.5rem',fontWeight:700,color:'#F5C842',display:'block',lineHeight:1}}>{s.n}</span>
              <span style={{fontSize:'0.68rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',display:'block',marginTop:5}}>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
        style={{position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:6,
          color:'rgba(255,255,255,0.25)',fontSize:'0.7rem',letterSpacing:'0.12em',textTransform:'uppercase',
        }}
      >
        <motion.div animate={{scaleY:[0,1,0]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
          style={{width:1,height:40,background:'linear-gradient(to bottom,rgba(196,181,253,0.5),transparent)',transformOrigin:'top'}}
        />
        Scroll
      </motion.div>

      <style>{`@keyframes goldShimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
    </section>
  )
}

function Section({id,bg,children,style={}}) {
  return (
    <section id={id} style={{padding:'96px 0',background:bg||'#fff',...style}}>
      <div style={{maxWidth:1140,margin:'0 auto',padding:'0 28px'}}>{children}</div>
    </section>
  )
}

function SectionHead({eyebrow,title,desc,dark}) {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,amount:0.3}}
      style={{marginBottom:52}}
    >
      <motion.p variants={fadeUp}
        style={{fontWeight:700,fontSize:'0.7rem',letterSpacing:'0.22em',textTransform:'uppercase',
          color: dark ? '#C4B5FD' : '#6B21A8',display:'inline-flex',alignItems:'center',gap:10,marginBottom:16}}
      >
        <span style={{width:20,height:1.5,background: dark?'#C4B5FD':'#6B21A8',display:'inline-block'}}/>
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp}
        style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(1.8rem,3.5vw,2.8rem)',fontWeight:700,lineHeight:1.1,
          color: dark ? 'white' : '#080818',marginBottom:14}}
      >{title}</motion.h2>
      {desc && <motion.p variants={fadeUp} style={{color: dark?'rgba(255,255,255,0.6)':'#52525b',fontSize:'1.05rem',maxWidth:560}}>{desc}</motion.p>}
    </motion.div>
  )
}

function About() {
  return (
    <Section id="about" bg="#f8f5ff">
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}} className="about-grid">
        <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <p style={{fontWeight:700,fontSize:'0.7rem',letterSpacing:'0.22em',textTransform:'uppercase',
            color:'#6B21A8',display:'inline-flex',alignItems:'center',gap:10,marginBottom:16}}
          ><span style={{width:20,height:1.5,background:'#6B21A8',display:'inline-block'}}/>Our Mission · Matthew 28:19</p>
          <h2 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(1.7rem,3vw,2.5rem)',fontWeight:700,lineHeight:1.2,color:'#080818',marginBottom:22}}>
            Go, therefore, and make disciples of all nations
          </h2>
          <p style={{color:'#52525b',fontSize:'1.05rem',lineHeight:1.8,marginBottom:20}}>
            Our mission is to spread the holy gospel of Jesus Christ and to make disciples of all nations, just as Christ commanded His followers. Everything we do — our worship, our teaching, our fellowship — flows from this calling.
          </p>
          <p style={{color:'#52525b',fontSize:'1.05rem',lineHeight:1.8,marginBottom:28}}>
            Only By Grace Worship Center is a home in Rehoboth where people encounter Jesus, grow in faith, and are equipped to carry the gospel into their families, workplaces, and communities.
          </p>
          <motion.a href="#members" whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
            style={{display:'inline-flex',alignItems:'center',gap:8,background:'#6B21A8',color:'white',
              fontWeight:700,fontSize:'0.95rem',padding:'13px 28px',borderRadius:30,
              boxShadow:'0 4px 20px rgba(107,33,168,0.35)'}}
          >Join Our Family →</motion.a>
        </motion.div>

        <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.15}}>
          <div style={{background:'linear-gradient(145deg,#3d0070,#7C3AED)',borderRadius:24,padding:40,
            position:'relative',overflow:'hidden',boxShadow:'0 20px 60px rgba(107,33,168,0.3)'}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:'6rem',color:'rgba(255,255,255,0.08)',
              position:'absolute',top:-8,left:16,lineHeight:1,pointerEvents:'none'}}>&#8220;</div>
            <p style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.2rem',lineHeight:1.7,
              paddingTop:36,color:'white',position:'relative',zIndex:1}}>
              "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost."
            </p>
            <span style={{display:'block',marginTop:22,color:'#F5C842',fontWeight:700,
              fontSize:'0.82rem',letterSpacing:'0.12em',textTransform:'uppercase'}}>Matthew 28:19</span>
            <div style={{marginTop:28,padding:20,background:'rgba(255,255,255,0.08)',borderRadius:14,
              border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(245,200,66,0.2)',
                border:'2px solid rgba(245,200,66,0.4)',flexShrink:0,display:'flex',alignItems:'center',
                justifyContent:'center',fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:'1.1rem',color:'#F5C842'}}>C</div>
              <div>
                <strong style={{color:'white',display:'block',fontFamily:"'Space Grotesk',sans-serif",fontSize:'1rem',marginBottom:3}}>Pastor Colin Van Wyk</strong>
                <span style={{color:'rgba(255,255,255,0.6)',fontSize:'0.88rem'}}>Senior Pastor · Only
