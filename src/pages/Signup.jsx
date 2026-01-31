import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { User, Calendar, Envelope, Lock, Phone, Briefcase, FileText, ArrowRight } from '@phosphor-icons/react';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'select',
        phone: '',
        age: '',
        profession: '',
        experience: '',
    });

    const [documentFile, setDocumentFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            setError('');
            setLoading(true);

            // 1. Create Authentication User FIRST
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Upload Document if provided (optional now)
            let docUrl = "";
            if (documentFile) {
                try {
                    const storageRef = ref(storage, `profession_docs/${user.uid}_${documentFile.name}`);
                    await uploadBytes(storageRef, documentFile);
                    docUrl = await getDownloadURL(storageRef);
                } catch (uploadError) {
                    console.error("Document upload failed:", uploadError);
                    // Continue without document - not critical
                }
            }

            // 3. Determine verification status
            const experience = parseInt(formData.experience) || 0;
            const verificationStatus = experience >= 2 ? "verified" : "pending";

            // 4. Create User Profile Data in Firestore
            const userProfile = {
                uid: user.uid,
                email: formData.email,
                name: formData.name || formData.email.split('@')[0], // Use email prefix if no name
                dob: formData.dob || "",
                gender: formData.gender !== 'select' ? formData.gender : "",
                phone: formData.phone || "",
                age: formData.age || "",
                profession: formData.profession || "Not specified",
                experience: formData.experience || "",
                photoUrl: "", // Default empty
                professionDocUrl: docUrl,
                verificationStatus: verificationStatus,
                createdAt: new Date().toISOString(),
                roles: {
                    education: true,
                    healthcare: true,
                    transport: true,
                    housing: true
                }
            };

            try {
                await setDoc(doc(db, "users", user.uid), userProfile);
                console.log("Profile created successfully");
            } catch (firestoreError) {
                console.error("Firestore write failed:", firestoreError);
                // User is still created in Auth, they can still use the app
                // The AuthContext will create a basic profile on next login
            }

            navigate("/"); // Redirect to dashboard
        } catch (err) {
            console.error("Signup error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please login instead.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password is too weak. Please use a stronger password.");
            } else if (err.code === 'auth/invalid-email') {
                setError("Invalid email address.");
            } else {
                setError("Failed to create account: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 z-10 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join the unified platform for all your needs</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Details */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="name" type="text" onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="John Doe (optional)" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="dob" type="date" onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select name="gender" onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                                <option value="select">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                            <input name="age" type="number" onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Age (optional)" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="phone" type="tel" onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="+1 234 567 890 (optional)" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Envelope className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input name="email" type="email" required onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="name@example.com" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Professional Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Profession</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input name="profession" type="text" onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Software Engineer (optional)" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                                <input name="experience" type="number" onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Years (optional)" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Profession Document (ID/Certificate)</label>
                                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" />
                                    <FileText className="mx-auto text-slate-400 mb-2" size={32} />
                                    <p className="text-sm text-slate-600">
                                        {documentFile ? documentFile.name : "Click or drag to upload (optional)"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input name="password" type="password" required onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="••••••••" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input name="confirmPassword" type="password" required onChange={handleChange} className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account (This may take a moment)...' : 'Create Account'}
                        <ArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
