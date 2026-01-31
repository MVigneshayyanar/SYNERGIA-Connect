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
            category: "Alphabet Learning",
            items: [
                { 
                    id: "apple", name: "A for Apple", icon: Circle, desc: "A sweet, edible fruit produced by an apple tree.",
                    render2D: ( <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">A</div> )
                },
                { 
                    id: "ball", name: "B for Ball", icon: Circle, desc: "A round object used in games.",
                    render2D: ( <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">B</div> )
                },
                { 
                    id: "can", name: "C for Can", icon: Stack, desc: "A cylindrical metal container.",
                    render2D: ( <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">C</div> )
                },
                { 
                    id: "dice", name: "D for Dice", icon: Square, desc: "A small object with marked sides used in games.",
                    render2D: ( <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">D</div> )
                },
                { 
                    id: "egg", name: "E for Egg", icon: Circle, desc: "An oval object laid by female birds.",
                    render2D: ( <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">E</div> )
                },
                { id: "flag", name: "F for Flag", icon: Square, desc: "A piece of cloth used as a symbol.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">F</div>) },
                { id: "gift", name: "G for Gift", icon: Square, desc: "A present given to someone.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">G</div>) },
                { id: "hat", name: "H for Hat", icon: Circle, desc: "A covering for the head.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">H</div>) },
                { id: "icecream", name: "I for Ice Cream", icon: Funnel, desc: "A frozen dessert.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">I</div>) },
                { id: "jar", name: "J for Jar", icon: Stack, desc: "A glass container.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">J</div>) },
                { id: "kite", name: "K for Kite", icon: Diamond, desc: "A toy that flies in the wind.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">K</div>) },
                { id: "lamp", name: "L for Lamp", icon: Funnel, desc: "A device that gives light.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">L</div>) },
                { id: "moon", name: "M for Moon", icon: Circle, desc: "The natural satellite of the earth.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">M</div>) },
                { id: "notebook", name: "N for Notebook", icon: Square, desc: "A book for writing notes.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">N</div>) },
                { id: "orange", name: "O for Orange", icon: Circle, desc: "A round reddish-yellow fruit.", render2D: (<div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300">O</div>) }
            ]
        },
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
            case "apple":
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        {/* Floating 'A' - Billboarded behavior helps but difficult in pure CSS, fixed rotation for now */}
                        <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" 
                             style={{ transform: "translateZ(0)" }}>
                            A
                        </div>

                        {/* Apple Body - Volumetric Construction with Multiple Slices */}
                        <div className="relative w-32 h-32 flex items-center justify-center" style={commonStyle}>
                             {/* Vertical Slices (Meridians) to create dense volume */}
                             {[0, 30, 60, 90, 120, 150].map((deg) => (
                                 <div key={deg} className="absolute inset-0 rounded-full bg-red-600/10 border border-red-500/40 backdrop-blur-[1px]" 
                                      style={{ transform: `rotateY(${deg}deg)` }}></div>
                             ))}
                             
                             {/* Horizontal Slices (Latitudes) for shape definition */}
                             <div className="absolute inset-0 m-auto w-28 h-28 rounded-full border border-red-400/30" style={{ transform: "rotateX(90deg) translateZ(10px)" }}></div>
                             <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-red-400/40" style={{ transform: "rotateX(90deg)" }}></div>
                             <div className="absolute inset-0 m-auto w-28 h-28 rounded-full border border-red-400/30" style={{ transform: "rotateX(90deg) translateZ(-10px)" }}></div>

                             {/* Inner Core Glow for Solidity */}
                             <div className="absolute w-24 h-24 bg-red-500/20 blur-md rounded-full"></div>
                        </div>

                        {/* Stem */}
                        <div className="absolute w-3 h-10 bg-amber-900 rounded-full" 
                             style={{ transform: "translateY(-45px)", transformOrigin: "bottom" }}></div>

                        {/* Leaf */}
                        <div className="absolute w-12 h-6 bg-green-600/80 rounded-tr-[24px] rounded-bl-[4px] border border-green-400 shadow-sm" 
                             style={{ transform: "translateY(-48px) translateX(12px) rotateZ(-30deg) rotateY(10deg) rotateX(10deg)" }}></div>
                    </div>
                )

            case "ball":
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>B</div>
                        {/* Ball Body - Blue Sphere */}
                         <div className="relative w-32 h-32 flex items-center justify-center" style={commonStyle}>
                             {[0, 30, 60, 90, 120, 150].map((deg) => (
                                 <div key={deg} className="absolute inset-0 rounded-full bg-blue-600/10 border border-blue-500/40 backdrop-blur-[1px]" style={{ transform: `rotateY(${deg}deg)` }}></div>
                             ))}
                             <div className="absolute w-28 h-28 rounded-full border border-blue-400/30" style={{ transform: "rotateX(90deg)" }}></div>
                             <div className="absolute w-24 h-24 bg-blue-500/20 blur-md rounded-full"></div>
                             {/* Stripe */}
                             <div className="absolute w-32 h-6 border-y-4 border-yellow-400/60 bg-yellow-400/20 rounded-[50%]" style={{ transform: "rotateZ(-15deg)" }}></div>
                        </div>
                    </div>
                )

            case "can":
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                         <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>C</div>
                         {/* Can Body - Cylinder */}
                         <div className="relative w-24 h-36 flex items-center justify-center" style={commonStyle}>
                            {[0, 45, 90, 135].map((deg) => (
                                <div key={deg} className="absolute w-24 h-36 bg-slate-300/20 border-x border-slate-400/40" style={{ transform: `rotateY(${deg}deg)` }}></div>
                            ))}
                            {/* Label */}
                            <div className="absolute w-24 h-24 bg-red-600/40 border-y border-red-500" style={{ transform: "translateZ(12px) rotateY(0deg)" }}></div>
                            <div className="absolute w-24 h-24 bg-red-600/40 border-y border-red-500" style={{ transform: "rotateY(90deg) translateZ(12px)" }}></div>

                            <div className="absolute w-24 h-24 rounded-full bg-slate-300/40 border border-slate-400" style={{ transform: "rotateX(90deg) translateZ(72px)" }}></div>
                            <div className="absolute w-24 h-24 rounded-full bg-slate-300/40 border border-slate-400" style={{ transform: "rotateX(90deg) translateZ(-72px)" }}></div>
                         </div>
                    </div>
                )

            case "dice":
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>D</div>
                        <div className="relative w-24 h-24" style={commonStyle}>
                             <div className="absolute inset-0 bg-white/90 border-2 border-slate-300 flex items-center justify-center" style={{ transform: "translateZ(48px)" }}>
                                 <div className="w-5 h-5 rounded-full bg-black shadow-inner"></div>
                             </div>
                             <div className="absolute inset-0 bg-white/90 border-2 border-slate-300 flex items-center justify-center" style={{ transform: "translateZ(-48px) rotateY(180deg)" }}>
                                 <div className="grid grid-cols-2 gap-2"><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>
                             </div>
                             <div className="absolute inset-0 bg-white/90 border-2 border-slate-300 flex items-center justify-center" style={{ transform: "translateX(48px) rotateY(90deg)" }}>
                                 <div className="flip flex gap-2"><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div></div>
                             </div>
                             <div className="absolute inset-0 bg-white/90 border-2 border-slate-300 flex items-center justify-center" style={{ transform: "translateX(-48px) rotateY(-90deg)" }}>
                                 <div className="flex gap-1 flex-wrap w-12 justify-center"><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div></div>
                             </div>
                             <div className="absolute inset-0 bg-white/90 border-2 border-slate-300 flex items-center justify-center" style={{ transform: "translateY(-48px) rotateX(90deg)" }}>
                                 <div className="rotate-45 flex gap-2"><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div></div>
                             </div>
                             <div className="absolute inset-0 bg-white/90 border-2 border-slate-300 flex items-center justify-center" style={{ transform: "translateY(48px) rotateX(-90deg)" }}>
                                 <div className="grid grid-cols-2 gap-3"><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div><div className="w-4 h-4 rounded-full bg-black"></div></div>
                             </div>
                        </div>
                    </div>
                )

            case "egg":
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                         <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>E</div>
                         <div className="relative w-24 h-32 flex items-center justify-center" style={commonStyle}>
                              {[0, 30, 60, 90, 120, 150].map((deg) => (
                                 <div key={deg} className="absolute inset-0 rounded-[50%/60%_60%_40%_40%] bg-amber-100/20 border border-amber-200/40 backdrop-blur-[1px]" style={{ transform: `rotateY(${deg}deg)` }}></div>
                             ))}
                             <div className="absolute w-20 h-20 bg-amber-200/20 blur-xl rounded-full"></div>
                         </div>
                    </div>
                )

            case "flag": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>F</div>
                     <div className="absolute w-2 h-64 bg-slate-400 rounded-full" style={{ transform: "translateX(-40px) translateY(20px)" }}></div>
                     <div className="absolute w-40 h-28 bg-red-500/80 border border-red-400 origin-left animate-pulse" style={{ transform: "translateX(-38px) translateY(-50px) rotateY(10deg)" }}></div>
                </div>
            )
            case "gift": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>G</div>
                     <div className="relative w-32 h-32" style={commonStyle}>
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500/50" style={{transform:"translateZ(64px)"}}></div>
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500/50" style={{transform:"rotateY(90deg) translateZ(64px)"}}></div>
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500/50" style={{transform:"rotateY(180deg) translateZ(64px)"}}></div>
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500/50" style={{transform:"rotateY(-90deg) translateZ(64px)"}}></div>
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500/50" style={{transform:"rotateX(90deg) translateZ(64px)"}}></div>
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-red-500/50" style={{transform:"rotateX(-90deg) translateZ(64px)"}}></div>
                        {/* Ribbon */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-yellow-400/80" style={{transform:"translateZ(65px)"}}></div>
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-yellow-400/80" style={{transform:"translateZ(65px)"}}></div>
                     </div>
                </div>
            )
            case "hat": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>H</div>
                     <div className="relative w-24 h-24" style={commonStyle}>
                        {/* Top Hat Body */}
                        <div className="absolute bottom-0 w-24 h-32 bg-slate-900 border-x border-slate-700" style={{transform:"translateY(10px)"}}></div>
                        <div className="absolute bottom-0 w-24 h-32 bg-slate-900 border-x border-slate-700" style={{transform:"translateY(10px) rotateY(90deg)"}}></div>
                        {/* Brim */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border-[20px] border-slate-900 bg-slate-900/50" style={{transform:"rotateX(90deg) translateZ(-40px)"}}></div>
                     </div>
                </div>
            )
            case "icecream": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>I</div>
                     {/* Cone */}
                     <div className="absolute bottom-0 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[90px] border-t-amber-300" style={{transform:"translateY(40px)"}}></div>
                     <div className="absolute bottom-0 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[90px] border-t-amber-300" style={{transform:"translateY(40px) rotateY(90deg)"}}></div>
                     {/* Scoop - Pink Sphere approximation */}
                     <div className="absolute top-8 w-24 h-24 rounded-full bg-pink-400 outline outline-4 outline-pink-300/50" style={{transform:"translateY(-20px)"}}></div>
                </div>
            )
            case "jar": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>J</div>
                     {/* Jar Body */}
                     {[0,45,90,135].map(d=><div key={d} className="absolute w-24 h-32 bg-cyan-100/20 border-x border-white/30" style={{transform:`rotateY(${d}deg)`}}></div>)}
                     {/* Lid */}
                     <div className="absolute w-24 h-24 rounded-full border-[4px] border-slate-400 bg-slate-300" style={{transform:"rotateX(90deg) translateZ(64px)"}}></div>
                </div>
            )
            case "kite": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>K</div>
                     <div className="w-32 h-40 bg-purple-500/80 rotate-45 border-4 border-white/50" style={{clipPath:"polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", transform:"rotateZ(0deg)"}}></div>
                     {/* Stick */}
                     <div className="absolute w-1 h-56 bg-white" style={{transform:"translateZ(-1px)"}}></div>
                     <div className="absolute w-40 h-1 bg-white" style={{transform:"translateZ(-1px) translateY(-10px)"}}></div>
                     {/* Tail */}
                     <div className="absolute w-1 h-32 bg-white origin-top animate-bounce delay-75" style={{transform:"translateY(80px)"}}></div>
                </div>
            )
            case "lamp": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>L</div>
                     {/* Shade */}
                     <div className="absolute top-0 w-32 h-24 bg-yellow-200/80 border-b-[40px] border-b-yellow-500 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent" style={{transform:"translateY(-20px)"}}></div>
                     {/* Base */}
                     <div className="absolute bottom-0 w-4 h-32 bg-slate-700" style={{transform:"translateY(40px)"}}></div>
                     <div className="absolute bottom-0 w-24 h-4 bg-slate-800 rounded-full" style={{transform:"translateY(56px) rotateX(90deg)"}}></div>
                </div>
            )
            case "moon": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>M</div>
                     <div className="w-32 h-32 rounded-full bg-slate-200 shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <div className="absolute top-6 left-6 w-6 h-6 rounded-full bg-slate-300 shadow-inner"></div>
                        <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-slate-300 shadow-inner"></div>
                        <div className="absolute top-12 right-6 w-4 h-4 rounded-full bg-slate-300 shadow-inner"></div>
                     </div>
                </div>
            )
            case "notebook": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>N</div>
                     <div className="w-32 h-44 bg-blue-600 rounded-r-xl border-l-[12px] border-l-black flex flex-col p-2 gap-2" style={{transform:"rotateY(-10deg)"}}>
                        <div className="w-full h-8 bg-white/20 rounded"></div>
                        <div className="w-full h-full bg-white/10 rounded"></div>
                     </div>
                </div>
            )
            case "orange": return (
                <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                     <div className="absolute -top-24 text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce" style={{ transform: "translateZ(0)" }}>O</div>
                     <div className="relative w-32 h-32 flex items-center justify-center" style={commonStyle}>
                             {[0, 30, 60, 90, 120, 150].map((deg) => <div key={deg} className="absolute inset-0 rounded-full bg-orange-500/10 border border-orange-500/40" style={{ transform: `rotateY(${deg}deg)` }}></div>)}
                             <div className="absolute w-24 h-24 bg-orange-500/20 blur-md rounded-full"></div>
                     </div>
                </div>
            )

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
            
            case "tri-prism":
                return (
                    <div className="relative flex items-center justify-center" style={commonStyle}>
                        {/* Sides: 3 rectangles. Width ~100px. dist ~29px? 100/2*tan(60) = 28.8 */}
                        <div className="absolute w-28 h-48 bg-cyan-500/20 border-2 border-cyan-400/50 backdrop-blur-sm" style={{ transform: "rotateY(0deg) translateZ(28px)" }}></div>
                        <div className="absolute w-28 h-48 bg-purple-500/20 border-2 border-purple-400/50 backdrop-blur-sm" style={{ transform: "rotateY(120deg) translateZ(28px)" }}></div>
                        <div className="absolute w-28 h-48 bg-blue-500/20 border-2 border-blue-400/50 backdrop-blur-sm" style={{ transform: "rotateY(240deg) translateZ(28px)" }}></div>

                        {/* Top & Bottom (Triangles) */}
                        <div className="absolute w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[104px] border-b-cyan-400/30 backdrop-blur-md" style={{ transform: "rotateX(90deg) translateZ(100px) translateY(-5px)" }}></div>
                        <div className="absolute w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[104px] border-b-cyan-400/30 backdrop-blur-md" style={{ transform: "rotateX(90deg) translateZ(-100px) translateY(-5px)" }}></div>
                    </div>
                )

            case "hex-prism":
                return (
                    <div className="relative flex items-center justify-center" style={commonStyle}>
                        {/* Sides: 6 rectangles. Width 60px. dist ~52px */}
                        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                            <div key={i} className="absolute w-16 h-48 bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-sm" 
                                style={{ transform: `rotateY(${deg}deg) translateZ(54px)` }}>
                            </div>
                        ))}
                        
                        {/* Top & Bottom (Hexagons) */}
                        <div className="absolute w-32 h-32 bg-cyan-400/30 backdrop-blur-md" 
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: "rotateX(90deg) translateZ(96px)" }}></div>
                        <div className="absolute w-32 h-32 bg-cyan-400/30 backdrop-blur-md" 
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: "rotateX(90deg) translateZ(-96px)" }}></div>
                    </div>
                )

            case "truncated-icosahedron": // Soccer Ball - Approximated as a Dodecahedron (12 Pentagons) for CSS feasibility
                // A true truncated icosahedron has 32 faces. We use 12 pentagons (Dodecahedron) as a stylized proxy.
                const pentagonClip = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";
                // Dihedral angle approx 116.565 deg? For Dodecahedron: 
                // We'll use a pre-calculated arrangement for CSS Dodecahedron
                const faces = [
                    { rX: 0, rY: 0, tZ: 60, rZ: 0 }, // Front?
                    // This is complex. Let's use a "Tech Sphere" approximation instead which looks cooler and closer to the icon style
                    // Rotating rings + Hexagons
                ];
                return (
                    <div className="relative w-48 h-48 flex items-center justify-center" style={commonStyle}>
                         {/* Core Sphere */}
                         <div className="absolute inset-0 rounded-full border border-cyan-500/30 bg-cyan-900/10 backdrop-blur-sm"></div>
                         
                         {/* Floating Hexagons on surface approximation */}
                         {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                             <div key={i} className="absolute w-16 h-16 bg-white/5 border border-white/20" 
                                  style={{ 
                                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                      transform: `rotateY(${deg}deg) rotateX(45deg) translateZ(90px)`
                                  }}>
                             </div>
                         ))}
                         {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                             <div key={i} className="absolute w-16 h-16 bg-white/5 border border-white/20" 
                                  style={{ 
                                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                      transform: `rotateY(${deg}deg) rotateX(-45deg) translateZ(90px)`
                                  }}>
                             </div>
                         ))}
                    </div>
                )

            case "frustum": // Truncated Pyramid (Square)
                return (
                    <div className="relative flex items-center justify-center" style={commonStyle}>
                        {/* Base (Large Square) */}
                        <div className="absolute w-40 h-40 bg-cyan-500/20 border border-cyan-400/50" style={{ transform: "rotateX(90deg) translateZ(-60px)" }}></div>
                        {/* Top (Small Square) */}
                        <div className="absolute w-20 h-20 bg-cyan-500/20 border border-cyan-400/50" style={{ transform: "rotateX(90deg) translateZ(60px)" }}></div>
                        
                        {/* 4 Trapezoidal Sides */}
                        {/* Front */}
                        <div className="absolute w-40 h-[124px] bg-cyan-400/10 border border-cyan-400/30" 
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)', transform: "translateZ(20px) rotateX(15deg) translateY(-10px)", height: '125px' }}></div>
                        {/* Back */}
                        <div className="absolute w-40 h-[124px] bg-cyan-400/10 border border-cyan-400/30" 
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)', transform: "rotateY(180deg) translateZ(20px) rotateX(15deg) translateY(-10px)", height: '125px' }}></div>
                        {/* Left */}
                        <div className="absolute w-40 h-[124px] bg-cyan-400/10 border border-cyan-400/30" 
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)', transform: "rotateY(-90deg) translateZ(20px) rotateX(15deg) translateY(-10px)", height: '125px' }}></div>
                        {/* Right */}
                        <div className="absolute w-40 h-[124px] bg-cyan-400/10 border border-cyan-400/30" 
                             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)', transform: "rotateY(90deg) translateZ(20px) rotateX(15deg) translateY(-10px)", height: '125px' }}></div>
                    </div>
                )

            case "prismatoid": // Wedge shape (Rectangular base, Top Line)
                 return (
                    <div className="relative flex items-center justify-center" style={commonStyle}>
                        {/* Base */}
                        <div className="absolute w-40 h-32 bg-cyan-500/20 border border-cyan-400/50" style={{ transform: "rotateX(90deg) translateZ(-60px)" }}></div>
                        
                        {/* Sloped Rectangles (Front/Back) */}
                        <div className="absolute w-40 h-[134px] bg-cyan-400/10 border border-cyan-400/30" style={{ transform: "translateZ(-16px) rotateX(24deg)" }}></div>
                        <div className="absolute w-40 h-[134px] bg-cyan-400/10 border border-cyan-400/30" style={{ transform: "rotateY(180deg) translateZ(-16px) rotateX(24deg)" }}></div>

                        {/* Triangular Ends (Left/Right) */}
                        <div className="absolute w-32 h-[120px] bg-cyan-500/20 border-b border-cyan-400/50" 
                             style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: "rotateY(-90deg) translateZ(80px)" }}></div>
                        <div className="absolute w-32 h-[120px] bg-cyan-500/20 border-b border-cyan-400/50" 
                             style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: "rotateY(90deg) translateZ(80px)" }}></div>
                    </div>
                 )

            case "dodecahedron":
                // 12 Pentagonal faces
                // CSS implementation is complex, using an approximate layout
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        {/* Lower Half */}
                        {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div key={`d-lower-${i}`} className="absolute w-24 h-24 bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-sm"
                                style={{ 
                                    clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                                    transform: `rotateY(${deg}deg) translateZ(35px) rotateX(-63.4deg)`,
                                    transformOrigin: "center bottom"
                                }}>
                            </div>
                        ))}
                        <div className="absolute w-24 h-24 bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-sm"
                             style={{ 
                                 clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                                 transform: `translateY(40px) rotateX(-90deg) rotateZ(36deg) translateZ(35px)` 
                             }}></div>

                        {/* Upper Half (Inverted) */}
                        {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div key={`d-upper-${i}`} className="absolute w-24 h-24 bg-purple-500/10 border border-purple-400/30 backdrop-blur-sm"
                                style={{ 
                                    clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                                    transform: `rotateY(${deg + 36}deg) translateZ(35px) rotateX(63.4deg)`,
                                    transformOrigin: "center top"
                                }}>
                            </div>
                        ))}
                        <div className="absolute w-24 h-24 bg-purple-500/10 border border-purple-400/30 backdrop-blur-sm"
                             style={{ 
                                 clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                                 transform: `translateY(-40px) rotateX(90deg) rotateZ(36deg) translateZ(35px)` 
                             }}></div>
                    </div>
                )

            case "icosahedron":
                // 20 Triangular faces (Equilateral)
                // Top Cap (5), Middle Band (10), Bottom Cap (5)
                const triHeight = 86; // approx for w=100
                const zDist = 70; // approx
                
                return (
                    <div className="relative w-40 h-40 flex items-center justify-center" style={commonStyle}>
                        {/* Top Cap (5) */}
                        {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div key={`i-top-${i}`} className="absolute w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[86px] border-b-cyan-400/20 backdrop-blur-sm"
                                style={{ 
                                    transformOrigin: "50% 100%",
                                    transform: `rotateY(${deg}deg) translateZ(30px) rotateX(37.4deg) translateY(-86px)`
                                }}>
                                <div className="absolute -left-[50px] top-[86px] w-[100px] h-[1px] bg-cyan-400/40"></div> {/* simple border approx */}
                            </div>
                        ))}
                        
                        {/* Middle Band (10 - 5 Pointing Down, 5 Pointing Up) */}
                         {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div key={`i-mid-down-${i}`} className="absolute w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-t-[86px] border-t-blue-500/20 backdrop-blur-sm"
                                style={{ 
                                    transformOrigin: "50% 0%",
                                    transform: `rotateY(${deg}deg) translateZ(80px) rotateX(0deg) translateY(-43px)`
                                }}>
                            </div>
                        ))}
                         {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div key={`i-mid-up-${i}`} className="absolute w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[86px] border-b-indigo-500/20 backdrop-blur-sm"
                                style={{ 
                                    transformOrigin: "50% 100%",
                                    transform: `rotateY(${deg + 36}deg) translateZ(80px) rotateX(180deg) translateY(43px) rotateX(180deg)` // tricky manual positioning
                                }}>
                            </div>
                        ))}

                        {/* Bottom Cap (5) */}
                         {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div key={`i-bot-${i}`} className="absolute w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-t-[86px] border-t-purple-400/20 backdrop-blur-sm"
                                style={{ 
                                    transformOrigin: "50% 0%",
                                    transform: `rotateY(${deg + 36}deg) translateZ(30px) rotateX(-37.4deg) translateY(0px)` // Approx
                                }}>
                            </div>
                        ))}
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
