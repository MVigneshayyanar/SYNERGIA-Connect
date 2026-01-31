import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile = null;
        let unsubscribeNotifications = null;
        let unsubscribeStats = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed:", user?.uid);
            setCurrentUser(user);

            // Cleanup previous listeners
            if (unsubscribeProfile) unsubscribeProfile();
            if (unsubscribeNotifications) unsubscribeNotifications();
            if (unsubscribeStats) unsubscribeStats();

            if (user) {
                // Real-time listener for user profile with error handling
                try {
                    unsubscribeProfile = onSnapshot(
                        doc(db, "users", user.uid),
                        async (docSnap) => {
                            console.log("Profile snapshot received:", docSnap.exists());
                            if (docSnap.exists()) {
                                const data = docSnap.data();
                                console.log("User profile data:", data);
                                setUserProfile(data);
                            } else {
                                console.log("No profile document found, creating one for user:", user.uid);
                                // Create a basic profile from auth data
                                const newProfile = {
                                    uid: user.uid,
                                    name: user.displayName || user.email?.split('@')[0] || "User",
                                    email: user.email,
                                    photoUrl: user.photoURL || "",
                                    verificationStatus: 'pending',
                                    profession: 'Not specified',
                                    createdAt: new Date().toISOString()
                                };
                                try {
                                    await setDoc(doc(db, "users", user.uid), newProfile);
                                    console.log("Created new profile document");
                                    setUserProfile(newProfile);
                                } catch (writeError) {
                                    console.error("Error creating profile:", writeError);
                                    setUserProfile(newProfile); // Still use the profile locally
                                }
                            }
                        },
                        (error) => {
                            console.error("Error fetching user profile:", error);
                            // Fallback to auth data
                            setUserProfile({
                                name: user.displayName || user.email?.split('@')[0] || "User",
                                email: user.email,
                                photoUrl: user.photoURL,
                                verificationStatus: 'pending'
                            });
                        }
                    );
                } catch (error) {
                    console.error("Error setting up profile listener:", error);
                }

                // Real-time listener for notifications (last 10)
                try {
                    const notificationsRef = collection(db, "users", user.uid, "notifications");
                    const notificationsQuery = query(notificationsRef, orderBy("createdAt", "desc"), limit(10));
                    unsubscribeNotifications = onSnapshot(
                        notificationsQuery,
                        (snapshot) => {
                            const notifs = snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));
                            setNotifications(notifs);
                        },
                        (error) => {
                            console.error("Error fetching notifications:", error);
                            setNotifications([]);
                        }
                    );
                } catch (error) {
                    console.error("Error setting up notifications listener:", error);
                }

                // Real-time listener for user stats
                try {
                    unsubscribeStats = onSnapshot(
                        doc(db, "users", user.uid, "stats", "current"),
                        (docSnap) => {
                            if (docSnap.exists()) {
                                setUserStats(docSnap.data());
                            } else {
                                // Default stats if none exist
                                setUserStats({
                                    education: { enrolled: false, course: "None" },
                                    healthcare: { active: false, nextCheckup: null },
                                    transport: { valid: false, expiryDate: null },
                                    housing: { eligible: false, status: "Not Applied" }
                                });
                            }
                        },
                        (error) => {
                            console.error("Error fetching user stats:", error);
                            setUserStats({
                                education: { enrolled: false, course: "None" },
                                healthcare: { active: false, nextCheckup: null },
                                transport: { valid: false, expiryDate: null },
                                housing: { eligible: false, status: "Not Applied" }
                            });
                        }
                    );
                } catch (error) {
                    console.error("Error setting up stats listener:", error);
                }
            } else {
                setUserProfile(null);
                setNotifications([]);
                setUserStats(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
            if (unsubscribeNotifications) unsubscribeNotifications();
            if (unsubscribeStats) unsubscribeStats();
        };
    }, []);

    const signup = async (email, password, profileData) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile document
        await setDoc(doc(db, "users", result.user.uid), {
            ...profileData,
            email,
            uid: result.user.uid,
            createdAt: new Date().toISOString(),
            verificationStatus: 'pending'
        });
        // Create default stats document
        await setDoc(doc(db, "users", result.user.uid, "stats", "current"), {
            education: { enrolled: false, course: "None" },
            healthcare: { active: false, nextCheckup: null },
            transport: { valid: false, expiryDate: null },
            housing: { eligible: false, status: "Not Applied" }
        });
        return result;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userProfile,
        notifications,
        userStats,
        loading,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
