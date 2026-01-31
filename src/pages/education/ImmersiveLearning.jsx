import { useState } from "react";
import { 
    Cube, Circle, Triangle, Square, Polygon, 
    Stack, Funnel, 
    Diamond, Hexagon, Star,
    SoccerBall,
    BoundingBox,
    Eye
} from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const ImmersiveLearning = () => {
    const [activeShapeId, setActiveShapeId] = useState("cube");

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

    const shapeCategories = [
        {
            category: "Platonic Solids",
            items: [
                { 
                    id: "tetrahedron", name: "Tetrahedron", icon: Triangle, desc: "A polyhedron composed of four triangular faces.",
                    render2D: (
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-500 fill-none stroke-2">
                            <polygon points="50,10 90,80 10,80" />
                            <line x1="50" y1="10" x2="50" y2="45" />
                            <line x1="10" y1="80" x2="50" y2="45" />
                            <line x1="90" y1="80" x2="50" y2="45" />
                        </svg>
                    )
                },
                { 
                    id: "cube", name: "Cube", icon: Square, desc: "A regular polyhedron bounded by six square faces.",
                    render2D: (
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-500 fill-none stroke-2">
                             <rect x="25" y="25" width="50" height="50" />
                             <line x1="25" y1="25" x2="10" y2="10" />
                             <line x1="75" y1="25" x2="90" y2="10" />
                             <line x1="25" y1="75" x2="10" y2="90" />
                             <line x1="75" y1="75" x2="90" y2="90" />
                             <rect x="10" y="10" width="80" height="80" />
                        </svg>
                    )
                },
                { 
                    id: "octahedron", name: "Octahedron", icon: Diamond, desc: "A polyhedron with eight faces, usually equilateral triangles.",
                    render2D: (
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-500 fill-none stroke-2">
                            <polygon points="50,10 90,50 50,90 10,50" />
                            <line x1="10" y1="50" x2="90" y2="50" />
                            <line x1="50" y1="10" x2="50" y2="90" />
                        </svg>
                    )
                },
                { 
                    id: "dodecahedron", name: "Dodecahedron", icon: Polygon, desc: "A regular polyhedron with twelve pentagonal faces.",
                    render2D: ( <Polygon size="100%" weight="thin" className="text-slate-500"/> )
                },
                { 
                    id: "icosahedron", name: "Icosahedron", icon: Star, desc: "A regular polyhedron with twenty triangular faces.",
                    render2D: ( <Star size="100%" weight="thin" className="text-slate-500"/> )
                }
            ]
        },
        {
            category: "Curved Solids",
            items: [
                { 
                    id: "sphere", name: "Sphere", icon: Circle, desc: "A perfectly round geometrical object in 3D space.",
                    render2D: ( <Circle size="100%" weight="thin" className="text-slate-500"/> )
                },
                { 
                    id: "cylinder", name: "Cylinder", icon: Stack, desc: "Points at a fixed distance from a given line segment.",
                    render2D: (
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-500 fill-none stroke-2">
                            <rect x="25" y="20" width="50" height="60" rx="0" />
                            <ellipse cx="50" cy="20" rx="25" ry="8" />
                            <ellipse cx="50" cy="80" rx="25" ry="8" />
                        </svg>
                    )
                },
                { 
                    id: "cone", name: "Cone", icon: Funnel, desc: "Tapers smoothly from a flat base to a point.",
                    render2D: (
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-500 fill-none stroke-2">
                            <ellipse cx="50" cy="80" rx="30" ry="10" />
                            <line x1="20" y1="80" x2="50" y2="10" />
                            <line x1="80" y1="80" x2="50" y2="10" />
                        </svg>
                    )
                },
                { 
                    id: "torus", name: "Torus", icon: Circle, desc: "Revolving a circle in 3D space about an axis.",
                    render2D: (
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-500 fill-none stroke-2">
                            <ellipse cx="50" cy="50" rx="40" ry="20" />
                            <ellipse cx="50" cy="50" rx="15" ry="5" />
                        </svg>
                    )
                },
                { 
                    id: "ellipsoid", name: "Ellipsoid", icon: Circle, desc: "A deformed sphere via directional scalings.",
                    render2D: ( <svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="45" ry="25" className="stroke-slate-500 fill-none stroke-2" /></svg> )
                }
            ]
        },
        {
            category: "Prisms & Pyramids",
            items: [
                { id: "rect-prism", name: "Cuboid", icon: Square, desc: "A convex polyhedron bounded by six quadrilateral faces.",
                 render2D: ( <Square size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "tri-prism", name: "Triangular Prism", icon: Triangle, desc: "A three-sided prism made of a triangular base.",
                 render2D: ( <Triangle size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "hex-prism", name: "Hexagonal Prism", icon: Hexagon, desc: "A prism with a hexagonal base and top.",
                 render2D: ( <Hexagon size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "sq-pyramid", name: "Square Pyramid", icon: Triangle, desc: "A pyramid having a square base.",
                 render2D: ( <Triangle size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "tri-pyramid", name: "Triangular Pyramid", icon: Triangle, desc: "A pyramid having a triangular base.",
                 render2D: ( <Triangle size="100%" weight="thin" className="text-slate-500"/> )
                }
            ]
        },
        {
            category: "Advanced / Compound",
            items: [
                { id: "truncated-icosahedron", name: "Soccer Ball", icon: SoccerBall, desc: "12 regular pentagonal faces and 20 regular hexagonal faces.",
                 render2D: ( <SoccerBall size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "prismatoid", name: "Prismatoid", icon: BoundingBox, desc: "Vertices all lie in two parallel planes.",
                  render2D: ( <BoundingBox size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "oblique-cylinder", name: "Oblique Cylinder", icon: Stack, desc: "A cylinder where the axis is not perpendicular to the base.",
                  render2D: ( <Stack size="100%" weight="thin" className="text-slate-500"/> )
                },
                { id: "frustum", name: "Frustum", icon: Funnel, desc: "The portion of a solid that lies between one or two parallel planes.",
                  render2D: ( <Funnel size="100%" weight="thin" className="text-slate-500"/> )
                }
            ]
        }
    ];

    // Flatten for easy search
    const allShapes = shapeCategories.flatMap(c => c.items);
    const currentShape = allShapes.find(s => s.id === activeShapeId) || allShapes[0];

    const renderShape3D = () => {
        const commonStyle = { transformStyle: "preserve-3d" };
        
        switch (activeShapeId) {
            case "cube":
            case "rect-prism":
                return (
                    <div className="relative w-40 h-40" style={commonStyle}>
                        <div className="absolute inset-0 bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-200 text-xs" style={{ transform: "translateZ(80px)" }}>FRONT</div>
                        <div className="absolute inset-0 bg-purple-500/10 border-2 border-purple-400/50 flex items-center justify-center text-purple-200 text-xs" style={{ transform: "translateZ(-80px) rotateY(180deg)" }}>BACK</div>
                        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/50 flex items-center justify-center text-blue-200 text-xs" style={{ transform: "translateX(-80px) rotateY(-90deg)" }}>LEFT</div>
                        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/50 flex items-center justify-center text-blue-200 text-xs" style={{ transform: "translateX(80px) rotateY(90deg)" }}>RIGHT</div>
                        <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-200 text-xs" style={{ transform: "translateY(-80px) rotateX(90deg)" }}>TOP</div>
                        <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-200 text-xs" style={{ transform: "translateY(80px) rotateX(-90deg)" }}>BOTTOM</div>
                    </div>
                );
                
            case "tetrahedron":
            case "tri-pyramid":
                // 4 triangles
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        <div className="absolute bottom-0 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] border-b-orange-500/40" style={{ transform: "rotateX(30deg) translateZ(30px)", transformOrigin: "bottom center" }}></div>
                        <div className="absolute bottom-0 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] border-b-red-500/40" style={{ transform: "rotateY(120deg) rotateX(30deg) translateZ(30px)", transformOrigin: "bottom center" }}></div>
                        <div className="absolute bottom-0 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] border-b-yellow-500/40" style={{ transform: "rotateY(240deg) rotateX(30deg) translateZ(30px)", transformOrigin: "bottom center" }}></div>
                        {/* Base */}
                         <div className="absolute bottom-0 w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] border-b-cyan-500/40" style={{ transform: "rotateX(90deg) translateZ(-60px)", transformOrigin: "bottom center" }}></div>
                    </div>
                );

            case "sq-pyramid":
                 return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        <div className="absolute inset-0 w-40 h-40 bg-cyan-500/20 border border-cyan-400/50" style={{ transform: "rotateX(90deg) translateZ(-50px)" }}></div> {/* Base */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[140px] border-b-orange-500/40" style={{ transform: "translateZ(20px) rotateX(30deg)" }}></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[140px] border-b-red-500/40" style={{ transform: "rotateY(90deg) translateZ(20px) rotateX(30deg)" }}></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[140px] border-b-yellow-500/40" style={{ transform: "rotateY(180deg) translateZ(20px) rotateX(30deg)" }}></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[140px] border-b-purple-500/40" style={{ transform: "rotateY(270deg) translateZ(20px) rotateX(30deg)" }}></div>
                    </div>
                 )

            case "octahedron":
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        {/* Top Pyramid */}
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-indigo-500/40" style={{ transform: "translateZ(0px) rotateX(35deg)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-blue-500/40" style={{ transform: "rotateY(90deg) translateZ(0px) rotateX(35deg)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-green-500/40" style={{ transform: "rotateY(180deg) translateZ(0px) rotateX(35deg)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-yellow-500/40" style={{ transform: "rotateY(270deg) translateZ(0px) rotateX(35deg)" }}></div>
                        
                        {/* Bottom Pyramid (Inverted) */}
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-indigo-500/40" style={{ transform: "rotateX(180deg) translateZ(0px) rotateX(35deg)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-blue-500/40" style={{ transform: "rotateX(180deg) rotateY(90deg) translateZ(0px) rotateX(35deg)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-green-500/40" style={{ transform: "rotateX(180deg) rotateY(180deg) translateZ(0px) rotateX(35deg)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-yellow-500/40" style={{ transform: "rotateX(180deg) rotateY(270deg) translateZ(0px) rotateX(35deg)" }}></div>
                    </div>
                )

            case "sphere":
            case "ellipsoid":
                return (
                    <div className={`relative ${activeShapeId === 'ellipsoid' ? 'w-64 h-40' : 'w-48 h-48'} rounded-full border border-cyan-500/30 shadow-[inset_0_0_50px_rgba(34,211,238,0.2)] bg-gradient-to-br from-cyan-500/20 to-transparent backdrop-blur-sm flex items-center justify-center`} style={commonStyle}>
                        <div className="absolute w-full h-full rounded-full border border-white/10" style={{ transform: "rotateX(60deg)" }}></div>
                        <div className="absolute w-full h-full rounded-full border border-white/10" style={{ transform: "rotateY(60deg)" }}></div>
                        <div className="absolute w-full h-full rounded-full border-2 border-cyan-400/30"></div>
                        <div className="absolute w-2 h-2 bg-white rounded-full shadow-glow"></div>
                    </div>
                )
            
            case "cylinder":
            case "oblique-cylinder":
                return (
                     <div className="relative w-32 h-48 flex items-center justify-center" style={{ ...commonStyle, transform: activeShapeId === 'oblique-cylinder' ? 'skewX(15deg) preserve-3d' : 'preserve-3d' }}>
                        {/* Body approximation */}
                        <div className="absolute w-32 h-48 bg-cyan-500/10 border-x border-cyan-500/50 backdrop-blur-sm"></div>
                        <div className="absolute w-32 h-48 bg-cyan-500/10 border-x border-cyan-500/50 backdrop-blur-sm" style={{ transform: "rotateY(60deg)" }}></div>
                        <div className="absolute w-32 h-48 bg-cyan-500/10 border-x border-cyan-500/50 backdrop-blur-sm" style={{ transform: "rotateY(-60deg)" }}></div>
                        
                        {/* Caps */}
                        <div className="absolute w-32 h-32 rounded-full border border-cyan-400/50 bg-cyan-500/20" style={{ transform: "rotateX(90deg) translateZ(96px)" }}></div>
                        <div className="absolute w-32 h-32 rounded-full border border-cyan-400/50 bg-cyan-500/20" style={{ transform: "rotateX(90deg) translateZ(-96px)" }}></div>
                     </div>
                )

            case "cone":
                return (
                    <div className="relative w-32 h-48 flex items-center justify-center" style={commonStyle}>
                        {/* Base */}
                        <div className="absolute w-32 h-32 rounded-full border border-cyan-400/50 bg-cyan-500/20" style={{ transform: "rotateX(90deg) translateZ(-80px)" }}></div>
                        {/* Sides - simplified as intersecting triangles */}
                        <div className="absolute top-0 w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-b-[190px] border-b-cyan-500/20" style={{ transform: "translateZ(0)" }}></div>
                        <div className="absolute top-0 w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-b-[190px] border-b-cyan-500/20" style={{ transform: "rotateY(90deg)" }}></div>
                    </div>
                )

            case "torus":
                 return (
                     <div className="relative w-56 h-56 flex items-center justify-center" style={commonStyle}>
                        <div className="absolute w-full h-full rounded-full border-[40px] border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]"></div>
                        <div className="absolute w-full h-full rounded-full border-[1px] border-white/20" style={{ transform: "rotateX(90deg)" }}></div>
                     </div>
                 )

            // Fallback Component for Complex shapes (Dodecahedron, Icosahedron, Prisms, Advanced)
            default:
                return (
                    <div className="relative w-48 h-64 bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]" style={commonStyle}>
                        <div className={`p-4 rounded-full bg-cyan-500/20 text-cyan-400 mb-4 shadow-inner`} style={{ transform: "translateZ(20px)" }}>
                            <currentShape.icon size={64} weight="duotone" />
                        </div>
                        <div className="text-center px-4" style={{ transform: "translateZ(30px)" }}>
                            <h3 className="text-white font-bold text-lg mb-1 leading-tight">{currentShape.name}</h3>
                            <div className={`h-1 w-12 mx-auto rounded-full bg-cyan-500 mt-2`}></div>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">Complex Geometry Model</p>
                        </div>
                        
                        {/* 3D Decor Elements */}
                        <div className={`absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full opacity-50 blur-sm`} style={{ transform: "translateZ(-10px)" }}></div>
                        <div className={`absolute -bottom-2 -left-2 w-12 h-12 bg-purple-500 rounded-full opacity-30 blur-md`} style={{ transform: "translateZ(-20px)" }}></div>
                    </div>
                )
        }
    }

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
                        value={activeShapeId}
                        onChange={(e) => setActiveShapeId(e.target.value)}
                        className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 block w-64 py-2.5 pl-4 pr-10 shadow-sm font-bold cursor-pointer transition-all outline-none"
                    >
                        {shapeCategories.map((group) => (
                            <optgroup key={group.category} label={group.category}>
                                {group.items.map((shape) => (
                                    <option key={shape.id} value={shape.id}>
                                        {shape.name}
                                    </option>
                                ))}
                            </optgroup>
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
                    <div className="bg-blue-600/40 backdrop-blur-md text-blue-100 px-3 py-1 rounded-lg text-xs font-mono border border-blue-400/20 hidden md:block">
                        {shapeCategories.find(c => c.items.some(i => i.id === activeShapeId))?.category}
                    </div>
                 </div>

                 {/* Top Right 2D View Panel */}
                 <div className="absolute top-6 right-6 z-20">
                     <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg w-32 h-32 flex flex-col items-center justify-center transition-all hover:bg-white/20">
                         <div className="w-16 h-16 mb-2 flex items-center justify-center">
                            {currentShape.render2D}
                         </div>
                         <p className="text-[10px] text-white/60 font-mono uppercase tracking-widest text-center">2D View</p>
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
                        {renderShape3D()}
                     </motion.div>

                     <div className="absolute bottom-32 text-center pointer-events-none opacity-50">
                        <p className="text-white text-sm tracking-widest uppercase">Hover to Rotate View</p>
                     </div>
                 </div>

                 {/* Compact Bottom Left Info Card */}
                 <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                     <div className="text-white bg-black/60 backdrop-blur-lg p-5 rounded-xl border border-white/10 w-64 shadow-2xl">
                        <p className="text-[10px] font-bold text-cyan-400 mb-1 uppercase tracking-wider">Selected Component</p>
                        <h3 className="font-bold text-xl leading-tight mb-2">{currentShape.name}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed opacity-90">
                            {currentShape.desc}
                        </p>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ImmersiveLearning;
