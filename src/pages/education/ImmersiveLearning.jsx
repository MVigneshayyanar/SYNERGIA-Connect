import { useRef } from "react";
import { Cube, BoundingBox } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const ImmersiveLearning = () => {
    // Motion values for mouse tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    
    // Convert mouse to rotation
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

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">360° Object Learning</h2>
                    <p className="text-slate-500">Hover inside the viewer to inspect the object from different angles.</p>
                 </div>
                 {/* Removed AR badge as requested */}
            </div>

            <div 
                className="flex-1 bg-slate-950 rounded-3xl relative overflow-hidden group shadow-2xl flex flex-col cursor-move"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                 <div className="absolute top-6 left-6 z-20 flex space-x-2">
                    <div className="bg-black/40 backdrop-blur-md text-white/70 px-3 py-1 rounded-lg text-xs font-mono border border-white/10">
                        FPS: 60
                    </div>
                    <div className="bg-black/40 backdrop-blur-md text-teal-400 px-3 py-1 rounded-lg text-xs font-mono border border-teal-400/20 flex items-center">
                        <BoundingBox className="mr-2" /> OBJ-VIEWER
                    </div>
                 </div>

                 {/* 3D Scene Container */}
                 <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0"></div>
                     
                    {/* Grid Pattern */}
                     <div className="absolute inset-0 z-0 opacity-20" style={{
                         backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }}></div>

                     {/* Interactive 3D Object */}
                     <motion.div 
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="relative z-10 w-64 h-64"
                     >
                         {/* Glowing Aura */}
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full"></div>
                        
                        {/* Simulated 3D Object (Using CSS 3D Cube construct for demo, or a single sprite that tilts) */}
                        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                             <Cube size={180} weight="thin" className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
                             
                             {/* Floating Annotations (Move in 3D space) */}
                             <motion.div 
                                style={{ z: 50 }}
                                className="absolute -top-10 -right-10 bg-black/60 backdrop-blur text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-500/30"
                             >
                                 Vertex: 82.4
                             </motion.div>
                             
                             <motion.div 
                                style={{ z: 20 }}
                                className="absolute -bottom-5 -left-5 bg-black/60 backdrop-blur text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30"
                             >
                                 Geometry
                             </motion.div>
                        </div>
                     </motion.div>

                     {/* Instructions Overlay (Fades out on hover) */}
                     <div className="absolute bottom-32 text-center pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity duration-500">
                        <p className="text-white text-sm tracking-widest uppercase">Hover to Rotate</p>
                     </div>
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none">
                     <div className="flex items-end justify-between">
                         <div className="text-white bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-sm">
                            <p className="text-xs font-bold text-cyan-400 mb-1">CURRENT ASSET</p>
                            <p className="font-bold text-lg">Human Heart (Anatomy)</p>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">High-fidelity 3D render. Move your mouse to inspect the object.</p>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ImmersiveLearning;
