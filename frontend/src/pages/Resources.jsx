import React, { useState } from 'react';
import { BookOpen, ArrowLeft, ExternalLink, Code, Globe, FlaskConical, Calculator, BookOpenCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Resources() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  // ✅ REAL RESOURCES WITH ACTUAL LINKS
  const resources = [
    {
      title: "JavaScript Mastery Guide",
      cat: "Programming",
      icon: <Code />,
      color: "border-indigo-200 bg-indigo-50",
      accent: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      desc: "MDN ka official JS guide — beginner se advanced tak, sab kuch covered hai.",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      linkLabel: "MDN Web Docs",
      type: "Article"
    },
    {
      title: "React.js Official Docs",
      cat: "Programming",
      icon: <Code />,
      color: "border-indigo-200 bg-indigo-50",
      accent: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      desc: "React ki nai official documentation — hooks, components, state management sab.",
      link: "https://react.dev/learn",
      linkLabel: "react.dev",
      type: "Docs"
    },
    {
      title: "Python for Data Science",
      cat: "Programming",
      icon: <Code />,
      color: "border-indigo-200 bg-indigo-50",
      accent: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      desc: "Kaggle ka free Python course — practical notebooks ke saath data science seekho.",
      link: "https://www.kaggle.com/learn/python",
      linkLabel: "Kaggle Learn",
      type: "Course"
    },
    {
      title: "Data Structures & Algorithms",
      cat: "Programming",
      icon: <Code />,
      color: "border-indigo-200 bg-indigo-50",
      accent: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      desc: "GeeksforGeeks DSA complete tutorial — arrays se graphs tak, interview prep ke liye best.",
      link: "https://www.geeksforgeeks.org/data-structures/",
      linkLabel: "GeeksforGeeks",
      type: "Tutorial"
    },
    {
      title: "SQL Database Commands",
      cat: "Programming",
      icon: <Code />,
      color: "border-indigo-200 bg-indigo-50",
      accent: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      desc: "W3Schools SQL tutorial — SELECT se JOIN tak, interactive examples ke saath.",
      link: "https://www.w3schools.com/sql/",
      linkLabel: "W3Schools SQL",
      type: "Tutorial"
    },

    {
      title: "World War II — Full Overview",
      cat: "History",
      icon: <Globe />,
      color: "border-amber-200 bg-amber-50",
      accent: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      desc: "Britannica ka detailed WWII article — causes, battles, aur aftermath sab clear.",
      link: "https://www.britannica.com/event/World-War-II",
      linkLabel: "Britannica",
      type: "Article"
    },
    {
      title: "Ancient Civilizations",
      cat: "History",
      icon: <Globe />,
      color: "border-amber-200 bg-amber-50",
      accent: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      desc: "Khan Academy ka free course — Egypt, Greece, Rome, Mesopotamia sab ek jagah.",
      link: "https://www.khanacademy.org/humanities/world-history/ancient-medieval",
      linkLabel: "Khan Academy",
      type: "Course"
    },
    {
      title: "Modern Indian History",
      cat: "History",
      icon: <Globe />,
      color: "border-amber-200 bg-amber-50",
      accent: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      desc: "NCERT Class 12 History PDF — Modern India chapter, free aur authentic.",
      link: "https://ncert.nic.in/textbook.php?lhst2=0-15",
      linkLabel: "NCERT Official",
      type: "PDF"
    },

    {
      title: "Quantum Physics Basics",
      cat: "Science",
      icon: <Zap />,
      color: "border-emerald-200 bg-emerald-50",
      accent: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
      desc: "MIT OpenCourseWare ka Quantum Physics I — lecture notes aur problem sets free.",
      link: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/",
      linkLabel: "MIT OpenCourseWare",
      type: "Course"
    },
    {
      title: "Organic Chemistry Reactions",
      cat: "Science",
      icon: <FlaskConical />,
      color: "border-emerald-200 bg-emerald-50",
      accent: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
      desc: "LibreTexts Organic Chemistry — free textbook, reactions aur mechanisms clearly explained.",
      link: "https://chem.libretexts.org/Bookshelves/Organic_Chemistry",
      linkLabel: "LibreTexts",
      type: "Textbook"
    },
    {
      title: "Human Anatomy — Complete Map",
      cat: "Science",
      icon: <FlaskConical />,
      color: "border-emerald-200 bg-emerald-50",
      accent: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
      desc: "Visible Body ka free anatomy explorer — 3D interactive human body, sab systems cover.",
      link: "https://www.kenhub.com/en/library/anatomy",
      linkLabel: "Kenhub Anatomy",
      type: "Interactive"
    },

    {
      title: "Calculus Fundamentals",
      cat: "Mathematics",
      icon: <Calculator />,
      color: "border-blue-200 bg-blue-50",
      accent: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      desc: "Paul's Online Math Notes — calculus ka sabse clear explanation, free PDF bhi available.",
      link: "https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx",
      linkLabel: "Paul's Math Notes",
      type: "Notes"
    },
    {
      title: "Advanced Algebra",
      cat: "Mathematics",
      icon: <Calculator />,
      color: "border-blue-200 bg-blue-50",
      accent: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      desc: "Khan Academy Algebra 2 — step-by-step lessons, practice problems aur videos.",
      link: "https://www.khanacademy.org/math/algebra2",
      linkLabel: "Khan Academy",
      type: "Course"
    },

    {
      title: "Classic Literature Summaries",
      cat: "Literature",
      icon: <BookOpenCheck />,
      color: "border-rose-200 bg-rose-50",
      accent: "text-rose-600",
      badge: "bg-rose-100 text-rose-700",
      desc: "SparkNotes — Shakespeare se Dostoevsky tak, sab books ke detailed summaries aur analysis.",
      link: "https://www.sparknotes.com/lit/",
      linkLabel: "SparkNotes",
      type: "Summary"
    },
    {
      title: "English Grammar — Complete Rules",
      cat: "Literature",
      icon: <BookOpenCheck />,
      color: "border-rose-200 bg-rose-50",
      accent: "text-rose-600",
      badge: "bg-rose-100 text-rose-700",
      desc: "Purdue OWL — grammar rules, writing guides, aur citation formats sab ek jagah.",
      link: "https://owl.purdue.edu/owl/general_writing/grammar/index.html",
      linkLabel: "Purdue OWL",
      type: "Guide"
    }
  ];

  const categories = ["All", "Programming", "History", "Science", "Mathematics", "Literature"];

  const typeColors = {
    "Course": "bg-violet-100 text-violet-700",
    "PDF": "bg-red-100 text-red-700",
    "Article": "bg-sky-100 text-sky-700",
    "Docs": "bg-cyan-100 text-cyan-700",
    "Tutorial": "bg-orange-100 text-orange-700",
    "Textbook": "bg-teal-100 text-teal-700",
    "Interactive": "bg-pink-100 text-pink-700",
    "Notes": "bg-lime-100 text-lime-700",
    "Guide": "bg-fuchsia-100 text-fuchsia-700",
    "Summary": "bg-rose-100 text-rose-700",
  };

  const filtered = activeFilter === "All" ? resources : resources.filter(r => r.cat === activeFilter);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Study Resources</h1>
              <p className="text-xs text-slate-500 font-bold mt-1 tracking-wider uppercase">15 Premium Modules • Real Links</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all tracking-wider shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DASHBOARD</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all tracking-wide ${
                activeFilter === cat
                  ? "bg-slate-800 text-white border-slate-800 shadow"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center font-medium">{filtered.length} resources</span>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border ${item.color} flex flex-col justify-between shadow-sm hover:shadow-md transition-all`}
            >
              <div className="mb-5">
                {/* Icon + Category + Type badges */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-white/50 text-slate-700">
                      {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-md border border-white/50">
                      {item.cat}
                    </span>
                  </div>
                  {/* Resource type badge */}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${typeColors[item.type] || "bg-slate-100 text-slate-600"}`}>
                    {item.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-slate-800 leading-tight mb-2">{item.title}</h3>

                {/* Description */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>

                {/* Source label */}
                <p className="text-[10px] text-slate-400 font-semibold mt-2 uppercase tracking-wider">
                  Source: {item.linkLabel}
                </p>
              </div>

              {/* CTA Button */}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <span>Read / Open Resource</span>
                <ExternalLink className="w-4 h-4 text-emerald-500" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}