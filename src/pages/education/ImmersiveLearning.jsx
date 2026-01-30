import { useState } from "react";
import { Cube, Circle, Triangle, Square, BoundingBox } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const ImmersiveLearning = () => {
    const [activeShape, setActiveShape] = useState("cube");

    // Motion values for mouse tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    
    // Convert mouse to rotation (Full 360 enabled)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["180deg", "-180deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-180deg", "180deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const shapes = [
        { id: "cube", name: "Cube", icon: Square, desc: "A 3D solid object bounded by six square faces, facets or sides." },
        { id: "sphere", name: "Sphere", icon: Circle, desc: "A geometrical object in 3D space that is the surface of a ball." },
        { id: "pyramid", name: "Pyramid", icon: Triangle, desc: "A polyhedron formed by connecting a polygonal base and a point." },
    ];

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in gap-6">
            <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">360° Geometry Explorer</h2>
                    <p className="text-slate-500">Select a component to inspect its properties in 3D.</p>
                 </div>
                 
                 {/* Shape Selector */}
                 <div className="relative group">
                    <select
                        value={activeShape}
                        onChange={(e) => setActiveShape(e.target.value)}
                        className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 block w-48 py-2.5 pl-4 pr-10 shadow-sm font-bold cursor-pointer transition-all outline-none"
                    >
                        {shapes.map((shape) => (
                            <option key={shape.id} value={shape.id}>
                                {shape.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>
                 </div>
            </div>

            <div 
                className="flex-1 bg-slate-950 rounded-3xl relative overflow-hidden group shadow-2xl flex flex-col cursor-move"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                 <div className="absolute top-6 left-6 z-20 flex space-x-2">
                    <div className="bg-black/40 backdrop-blur-md text-white/70 px-3 py-1 rounded-lg text-xs font-mono border border-white/10">
                        Interactive Mode
                    </div>
                 </div>

                 {/* 3D Scene Container */}
                 <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0"></div>
                    <div className="absolute inset-0 z-0 opacity-20" style={{
                         backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }}></div>

                     {/* Interactive 3D Object Group */}
                     <motion.div 
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative z-10 w-64 h-64 flex items-center justify-center"
                     >
                        {/* CUBE RENDERER */}
                        {activeShape === "cube" && (
                            <div className="relative w-40 h-40" style={{ transformStyle: "preserve-3d" }}>
                                {/* Faces */}
                                <div className="absolute inset-0 bg-cyan-500/10 border-2 border-cyan-400/50 backdrop-blur-sm flex items-center justify-center text-cyan-200 font-mono text-xs translate-z-[80px]" style={{ transform: "translateZ(80px)" }}>FRONT</div>
                                <div className="absolute inset-0 bg-purple-500/10 border-2 border-purple-400/50 backdrop-blur-sm flex items-center justify-center text-purple-200 font-mono text-xs" style={{ transform: "translateZ(-80px) rotateY(180deg)" }}>BACK</div>
                                <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/50 backdrop-blur-sm flex items-center justify-center text-blue-200 font-mono text-xs" style={{ transform: "translateX(-80px) rotateY(-90deg)" }}>LEFT</div>
                                <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/50 backdrop-blur-sm flex items-center justify-center text-blue-200 font-mono text-xs" style={{ transform: "translateX(80px) rotateY(90deg)" }}>RIGHT</div>
                                <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400/50 backdrop-blur-sm flex items-center justify-center text-emerald-200 font-mono text-xs" style={{ transform: "translateY(-80px) rotateX(90deg)" }}>TOP</div>
                                <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400/50 backdrop-blur-sm flex items-center justify-center text-emerald-200 font-mono text-xs" style={{ transform: "translateY(80px) rotateX(-90deg)" }}>BOTTOM</div>

                                {/* Annotations */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" style={{ transform: "translateZ(80px)" }}></div>
                                <div className="absolute -top-12 -right-12 text-white bg-black/60 px-2 py-1 rounded text-xs border border-white/20" style={{ transform: "translateZ(80px)" }}>
                                    Vertex (Corner)
                                </div>

                                <div className="absolute top-1/2 -right-2 w-1 h-40 -translate-y-1/2 bg-cyan-400 shadow-[0_0_15px_cyan]" style={{ transform: "translateZ(80px)" }}></div>
                                <div className="absolute top-1/2 -right-24 text-cyan-300 bg-black/60 px-2 py-1 rounded text-xs border border-cyan-500/30" style={{ transform: "translateZ(80px)" }}>
                                    Edge (Line)
                                </div>
                            </div>
                        )}

                        {/* SPHERE RENDERER */}
                        {activeShape === "sphere" && (
                            <div className="relative w-48 h-48 rounded-full border border-cyan-500/30 shadow-[inset_0_0_50px_rgba(34,211,238,0.2)] bg-gradient-to-br from-cyan-500/20 to-transparent backdrop-blur-sm flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                                {/* Equatorial Lines */}
                                <div className="absolute w-full h-full rounded-full border border-white/10" style={{ transform: "rotateX(60deg)" }}></div>
                                <div className="absolute w-full h-full rounded-full border border-white/10" style={{ transform: "rotateY(60deg)" }}></div>
                                <div className="absolute w-full h-full rounded-full border-2 border-cyan-400/30"></div>

                                {/* Center and Radius */}
                                <div className="absolute w-2 h-2 bg-white rounded-full shadow-glow"></div>
                                <div className="absolute w-1/2 h-0.5 bg-yellow-400 origin-left left-1/2 top-1/2"></div>
                                <div className="absolute top-[40%] right-4 text-yellow-300 text-xs bg-black/60 px-2 rounded">Radius (r)</div>
                                
                                <div className="absolute -bottom-8 text-cyan-200 text-xs bg-black/60 px-2 py-1 rounded border border-cyan-500/30">
                                    Circumference
                                </div>
                            </div>
                        )}

                        {/* PYRAMID Visual (Simplified) */}
                        {activeShape === "pyramid" && (
                            <div className="relative w-40 h-40 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                                <div className="relative" style={{ transformStyle: "preserve-3d", transform: "rotateX(-20deg)" }}>
                                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80px] w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-orange-500/40 backdrop-blur-md bg-blend-screen" style={{ transform: "translateZ(10px)" }}></div>
                                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80px] w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-red-500/40 backdrop-blur-md" style={{ transform: "rotateY(90deg) translateZ(10px)" }}></div>
                                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80px] w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-yellow-500/40 backdrop-blur-md" style={{ transform: "rotateY(45deg) translateZ(10px)" }}></div>
                                     
                                     {/* Apex Annotation */}
                                     <div className="absolute -top-24 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] -translate-x-1/2"></div>
                                     <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-white bg-black/60 px-2 py-1 rounded text-xs border border-white/20 whitespace-nowrap">
                                        Apex (Top View)
                                     </div>
                                </div>
                            </div>
                        )}
                     </motion.div>

                     <div className="absolute bottom-32 text-center pointer-events-none opacity-50">
                        <p className="text-white text-sm tracking-widest uppercase">Hover to Rotate View</p>
                     </div>
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none">
                     <div className="flex items-end justify-between">
                         <div className="text-white bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-sm">
                            <p className="text-xs font-bold text-cyan-400 mb-1">SELECTED COMPONENT</p>
                            <p className="font-bold text-lg">{shapes.find(s => s.id === activeShape)?.name}</p>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                {shapes.find(s => s.id === activeShape)?.desc}
                            </p>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ImmersiveLearning;
