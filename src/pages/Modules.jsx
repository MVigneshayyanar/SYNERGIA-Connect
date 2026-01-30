import Home from "./education/Home";
import HealthcareComponent from "./healthcare/Healthcare";

export const Education = () => (
    <Home />
);

export const Healthcare = () => (
    <HealthcareComponent />
);

export const Transport = () => (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-slate-800">Transport Module</h2>
        <p className="text-slate-500 mt-2">View schedules and manage transit passes.</p>
    </div>
);

export const Housing = () => (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-slate-800">Housing Module</h2>
        <p className="text-slate-500 mt-2">Apply for housing support and view status.</p>
    </div>
);
