import { useState } from "react";
import { 
  ArrowLeft, 
  UploadSimple, 
  FileText, 
  CheckCircle, 
  Warning, 
  Spinner,
  FloppyDisk 
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useApp } from "../../context/AppContext";

const ConsentFormScanner = () => {
    const navigate = useNavigate();
    const { addNotification } = useApp();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setScanResult(null);
            setError(null);
        }
    };

    const handleScan = async () => {
        if (!file) return;
        
        setScanning(true);
        setError(null);
        
        try {
            const result = await api.scanConsentForm(file);
            setScanResult(result);
            addNotification({
                title: "Scan Complete",
                message: "Patient details extracted successfully.",
                type: "success"
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to scan document");
            addNotification({
                title: "Scan Failed",
                message: err.message || "Could not process the document.",
                type: "error"
            });
        } finally {
            setScanning(false);
        }
    };

    const handleSave = async () => {
        if (!scanResult) return;
        try {
            await api.savePatientDetails(scanResult);
            addNotification({
                title: "Saved",
                message: "Patient record created successfully.",
                type: "success"
            });
            navigate("/healthcare");
        } catch (err) {
            addNotification({
                title: "Save Failed",
                message: "Could not save patient record.",
                type: "error"
            });
        }
    };

    return (
        <div className="min-h-full pb-12 animate-fade-in relative">
            <button 
                onClick={() => navigate("/healthcare")} 
                className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors group font-medium"
            >
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mr-3 group-hover:border-slate-300 transition-all">
                    <ArrowLeft size={18} weight="bold"/>
                </div>
                Back to Healthcare Hub
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Consent Form Scanner</h1>
                <p className="text-slate-500 mt-2 text-lg">AI-powered extraction of patient details from physical forms.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Upload & Preview */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center hover:bg-slate-50 transition-colors relative">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="pointer-events-none">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UploadSimple size={32} weight="bold" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Upload Consent Form</h3>
                            <p className="text-slate-500 text-sm mt-1">Click or drag and drop image here</p>
                        </div>
                    </div>

                    {preview && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <img src={preview} alt="Form Preview" className="w-full h-auto rounded-xl" />
                            {scanning && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                    <Spinner size={48} className="text-indigo-600 animate-spin mb-4" />
                                    <p className="font-bold text-indigo-900">Analyzing Document...</p>
                                    <p className="text-sm text-indigo-700">Extracting patient data with Gemini AI</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {file && !scanning && !scanResult && (
                        <button 
                            onClick={handleScan}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center"
                        >
                            <FileText size={20} className="mr-2" weight="fill" />
                            Scan Document
                        </button>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="space-y-6">
                    {scanResult ? (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
                            <div className="bg-green-50 p-6 border-b border-green-100 flex items-center">
                                <CheckCircle size={28} className="text-green-600 mr-3" weight="fill" />
                                <div>
                                    <h3 className="font-bold text-green-900">Extraction Successful</h3>
                                    <p className="text-sm text-green-700">Please review the details below.</p>
                                </div>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoField label="Patient Name" value={scanResult.patientName} />
                                    <InfoField label="Date of Birth" value={scanResult.dateOfBirth} />
                                    <InfoField label="Gender" value={scanResult.gender} />
                                    <InfoField label="Contact" value={scanResult.phoneNumber} />
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                                        <Warning size={18} className="text-amber-500 mr-2" />
                                        Medical Info
                                    </h4>
                                    <div className="space-y-4">
                                        <InfoList label="Conditions" items={scanResult.medicalConditions} />
                                        <InfoList label="Allergies" items={scanResult.allergies} />
                                        <InfoList label="Current Medications" items={scanResult.medications} />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Consent Date</p>
                                        <p className="font-medium text-slate-800">{scanResult.consentDate || "N/A"}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${scanResult.hasSignature ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {scanResult.hasSignature ? "Signed" : "Unsigned"}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        onClick={handleSave}
                                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center"
                                    >
                                        <FloppyDisk size={20} className="mr-2" weight="fill" />
                                        Save Patient Record
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                            <FileText size={64} className="mb-4 opacity-20" />
                            <p className="text-center font-medium">Upload a form to see extracted details here.</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm font-medium flex items-center">
                            <Warning size={20} className="mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value }) => (
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
        <p className="font-bold text-slate-800 text-lg">{value || "N/A"}</p>
    </div>
);

const InfoList = ({ label, items }) => (
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">{label}</p>
        {items && items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        {item}
                    </span>
                ))}
            </div>
        ) : (
            <p className="text-slate-400 text-sm italic">None detected</p>
        )}
    </div>
);

export default ConsentFormScanner;
