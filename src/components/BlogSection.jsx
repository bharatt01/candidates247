import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  X,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  User,
  Share2,
  Bookmark,
} from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "How to Crack Your First React.js Interview in 2026",
    excerpt:
      "The React ecosystem has evolved. Here is what hiring managers actually test for now.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    category: "Frontend",
    author: "Rohit Mehta",
    date: "Jun 12, 2026",
    readTime: "8 min read",
    content: `
      <p>React interviews in 2026 are no longer about memorizing lifecycle methods. Hiring managers want to see how you think about component architecture, state management at scale, and performance bottlenecks.</p>
      <h3>What Has Changed</h3>
      <p>The shift from class components to hooks was just the beginning. Now, interviewers focus on:</p>
      <ul>
        <li>Custom hooks design patterns</li>
        <li>Concurrent rendering and Suspense boundaries</li>
        <li>Server Components vs Client Components</li>
        <li>Performance profiling with React DevTools</li>
      </ul>
      <h3>The Real Questions</h3>
      <p>Expect live coding challenges where you build a feature from scratch. Not leetcode. Real UI problems. A recent candidate was asked to build a virtualized list with drag-and-drop in 45 minutes.</p>
    `,
  },
  {
    id: 2,
    title: "Python vs JavaScript: Which Should You Learn First?",
    excerpt:
      "A no-nonsense breakdown for beginners. We compare job markets and learning curves.",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop",
    category: "Career",
    author: "Sneha Kapoor",
    date: "Jun 10, 2026",
    readTime: "6 min read",
    content: `
      <p>The eternal debate. But in 2026, the answer depends on what you want to build — not what is trending on Twitter.</p>
      <h3>Start with Python if...</h3>
      <p>You want to enter data science, machine learning, or backend engineering. Python's syntax is forgiving, and the job market for AI/ML roles is exploding.</p>
      <h3>Start with JavaScript if...</h3>
      <p>You want to build products people see and touch. Frontend, full-stack, mobile — JavaScript runs the web. Period.</p>
    `,
  },
  {
    id: 3,
    title: "The Rise of AI Engineers: A New Job Title Explained",
    excerpt:
      "Not a data scientist. Not a software engineer. The AI Engineer sits at the intersection of both.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    category: "AI/ML",
    author: "Vikas Yadav",
    date: "Jun 8, 2026",
    readTime: "10 min read",
    content: `
      <p>AI Engineers are the new Full-Stack Developers. They do not just train models — they ship them into production.</p>
      <h3>What They Actually Do</h3>
      <p>Prompt engineering, RAG pipeline architecture, fine-tuning open-source models, and building LLM-powered features into existing products.</p>
      <h3>Skills You Need</h3>
      <p>Python, vector databases, API design, and a deep understanding of how transformers work. Not just calling OpenAI's API.</p>
    `,
  },
  {
    id: 4,
    title: "System Design for Interviews: A Practical Guide",
    excerpt:
      "Forget the theory. Here is how to approach system design rounds at product companies.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    category: "Backend",
    author: "Ananya Gupta",
    date: "Jun 5, 2026",
    readTime: "12 min read",
    content: `
      <p>System design interviews are not about knowing every database. They are about trade-offs.</p>
      <h3>The Framework</h3>
      <p>Start with requirements. Clarify functional and non-functional. Then sketch. Do not jump into microservices.</p>
      <h3>Common Mistakes</h3>
      <p>Over-engineering for scale you will never hit. Ignoring data consistency. Not discussing monitoring and alerting.</p>
    `,
  },
  {
    id: 5,
    title: "Remote Work in 2026: What Hiring Managers Actually Want",
    excerpt:
      "The remote work landscape has stabilized. Here is what separates candidates who get hired.",
    image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&h=500&fit=crop",
    category: "Career",
    author: "Karan Mehta",
    date: "Jun 2, 2026",
    readTime: "5 min read",
    content: `
      <p>Remote work is no longer a perk. It is the default. But the bar has risen.</p>
      <h3>Communication Skills</h3>
      <p>Async communication, documentation, and the ability to work without hand-holding. These are now baseline expectations.</p>
      <h3>Time Zone Flexibility</h3>
      <p>Companies are hiring globally. Being willing to overlap with core team hours — even if it means early mornings — is a massive advantage.</p>
    `,
  },
  {
    id: 6,
    title: "DevOps in 2026: Kubernetes Is Not Enough Anymore",
    excerpt:
      "Platform engineering, internal developer platforms, and GitOps — the DevOps role has evolved.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
    category: "DevOps",
    author: "Rahul Sharma",
    date: "May 28, 2026",
    readTime: "9 min read",
    content: `
      <p>Kubernetes is table stakes. The real value is in platform engineering — building internal tools that make developers faster.</p>
      <h3>The Shift to Platform Engineering</h3>
      <p>Instead of managing infrastructure, you are building self-service platforms. Developers deploy without opening tickets.</p>
      <h3>Tools to Know</h3>
      <p>Backstage, Crossplane, ArgoCD, and Terraform Cloud. Plus, a solid understanding of cost optimization.</p>
    `,
  },
  {
    id: 7,
    title: "Data Science Career Path: From Analyst to Lead",
    excerpt:
      "A roadmap for data professionals looking to grow into leadership roles in 2026.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    category: "Data",
    author: "Priya Nair",
    date: "May 25, 2026",
    readTime: "11 min read",
    content: `
      <p>The data science career ladder has changed. Individual contributor tracks now rival management tracks in compensation and prestige.</p>
      <h3>Level 1: Data Analyst</h3>
      <p>SQL, Excel, basic Python. You answer questions the business already has.</p>
      <h3>Level 2: Data Scientist</h3>
      <p>Machine learning, statistical modeling, A/B testing. You find questions the business didn't know to ask.</p>
      <h3>Level 3: Lead / Principal</h3>
      <p>Architecture, team strategy, cross-functional influence. You define what data means for the entire organization.</p>
    `,
  },
  {
    id: 8,
    title: "Cybersecurity in 2026: Beyond the Basics",
    excerpt:
      "Threat modeling, zero trust architecture, and the skills that actually get you hired in security.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
    category: "Security",
    author: "Divya Krishnan",
    date: "May 22, 2026",
    readTime: "7 min read",
    content: `
      <p>Cybersecurity is no longer about firewalls and antivirus. It is about understanding how systems fail before attackers do.</p>
      <h3>Threat Modeling</h3>
      <p>Every feature starts with "what could go wrong?" STRIDE, attack trees, and risk matrices are now part of the design process.</p>
      <h3>Zero Trust Architecture</h3>
      <p>Never trust, always verify. Every request is authenticated, every action is logged, every boundary is assumed breached.</p>
    `,
  },
];

const BlogSection = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[hsl(38,70%,96%)] text-[hsl(300,18%,16%)]">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[hsl(32,90%,92%)] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[hsl(32,88%,85%)] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* CENTERED HEADER */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
             </div>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-[0.9] mb-4">
            Latest <span className="text-[hsl(32,88%,55%)]">News</span>
          </h2>
    <p className="text-[hsl(300,12%,45%)] max-w-xl mx-auto leading-relaxed">
           Expert Career advice, industry trends, interview preparation, hiring insights and practical guidance to help Candidates grow faster in their careers.
     </p>
        </div>

        {/* Navigation + Scroll Controls */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(300,12%,45%)]">
          
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur border border-[hsl(38,35%,86%)] flex items-center justify-center hover:bg-[hsl(32,88%,55%)] hover:text-white hover:border-[hsl(32,88%,55%)] transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur border border-[hsl(38,35%,86%)] flex items-center justify-center hover:bg-[hsl(32,88%,55%)] hover:text-white hover:border-[hsl(32,88%,55%)] transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLOG CAROUSEL — Single horizontal row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {blogs.map((blog, index) => (
            <motion.button
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              viewport={{ once: true }}
              onClick={() => setSelectedBlog(blog)}
              className="group flex-shrink-0 w-[280px] snap-start text-left bg-white/80 backdrop-blur-xl border border-[hsl(38,35%,86%)] rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(180,120,40,0.06)] hover:shadow-[0_20px_60px_rgba(180,120,40,0.12)] transition-all duration-500 hover:border-[hsl(32,88%,55%)]/30"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur text-[hsl(32,88%,55%)] text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold border border-[hsl(38,35%,86%)]">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold tracking-tight mb-2 group-hover:text-[hsl(32,88%,55%)] transition-colors duration-300 line-clamp-2 leading-snug">
                  {blog.title}
                </h3>
                <p className="text-xs text-[hsl(300,12%,45%)] leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-[hsl(300,12%,45%)]">
                    <span className="font-semibold text-[hsl(300,18%,16%)]">{blog.author}</span>
                    <span className="w-1 h-1 bg-[hsl(300,12%,45%)]/30 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{blog.readTime}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[hsl(32,90%,95%)] flex items-center justify-center group-hover:bg-[hsl(32,88%,55%)] transition-colors duration-300">
                    <ArrowRight className="w-3.5 h-3.5 text-[hsl(32,88%,55%)] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* FOOTER */}
       
      </div>

      {/* FULL BLOG MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[hsl(300,18%,16%)]/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 lg:p-8"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-[hsl(38,70%,96%)] rounded-[2rem] overflow-hidden shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center border border-[hsl(38,35%,86%)] hover:bg-[hsl(32,88%,55%)] hover:text-white hover:border-[hsl(32,88%,55%)] transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative h-64 lg:h-96 overflow-hidden">
                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[hsl(300,18%,16%)]/20" />
                <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
                  <span className="bg-[hsl(32,88%,55%)] text-white text-[10px] uppercase tracking-wider px-4 py-2 rounded-full font-bold">{selectedBlog.category}</span>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-[hsl(300,12%,45%)]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[hsl(32,90%,95%)] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[hsl(32,88%,55%)]" />
                    </div>
                    <span className="font-semibold text-[hsl(300,18%,16%)]">{selectedBlog.author}</span>
                  </div>
                  <span className="w-1 h-1 bg-[hsl(300,12%,45%)]/30 rounded-full" />
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedBlog.date}</span>
                  <span className="w-1 h-1 bg-[hsl(300,12%,45%)]/30 rounded-full" />
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedBlog.readTime}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-8 leading-tight">{selectedBlog.title}</h1>
                <div className="prose prose-lg max-w-none text-[hsl(300,18%,16%)] leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                <div className="mt-10 pt-8 border-t border-[hsl(38,35%,86%)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(32,90%,95%)] text-[hsl(32,88%,55%)] text-sm font-semibold hover:bg-[hsl(32,88%,55%)] hover:text-white transition-colors">
                      <Bookmark className="w-4 h-4" />Save
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(32,90%,95%)] text-[hsl(32,88%,55%)] text-sm font-semibold hover:bg-[hsl(32,88%,55%)] hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />Share
                    </button>
                  </div>
                  <button onClick={() => setSelectedBlog(null)} className="flex items-center gap-2 text-sm text-[hsl(300,12%,45%)] hover:text-[hsl(32,88%,55%)] transition-colors font-semibold">
                    <ArrowLeft className="w-4 h-4" />Back to Blogs
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection;
