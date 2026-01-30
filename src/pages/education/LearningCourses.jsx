import { BookOpen, PlayCircle, Clock } from "@phosphor-icons/react";

const LearningCourses = () => {
  const courses = [
    { id: 1, title: "Web Development Mastery", progress: 75, total: 24, completed: 18, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 2, title: "Data Science Fundamentals", progress: 30, total: 40, completed: 12, color: "text-purple-500", bg: "bg-purple-50" },
    { id: 3, title: "UX/UI Design Principles", progress: 0, total: 15, completed: 0, color: "text-teal-500", bg: "bg-teal-50" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Learning Courses</h2>
           <p className="text-slate-500">Continue your education journey</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
          Browse Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group cursor-pointer hover:-translate-y-1">
            <div className={`h-40 rounded-xl mb-4 ${course.bg} flex items-center justify-center relative overflow-hidden`}>
                 <BookOpen size={48} className={`${course.color} opacity-80 group-hover:scale-110 transition-transform duration-300`} weight="duotone" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{course.title}</h3>
            <div className="flex items-center text-xs text-slate-500 mb-4 space-x-3">
                <span className="flex items-center"><PlayCircle className="mr-1" weight="fill"/> {course.total} Lessons</span>
                <span className="flex items-center"><Clock className="mr-1" weight="fill"/> 12h 30m</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${course.color.replace('text-', 'bg-')} transition-all duration-1000`} 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>{course.progress}% Complete</span>
                <span>{course.completed}/{course.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningCourses;
