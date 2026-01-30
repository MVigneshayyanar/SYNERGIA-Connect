# Firebase Security Rules

To ensure your application allows users to post events and upload posters, you need to update your rules in the Firebase Console.

## 1. Firestore Database Rules

Go to **Firebase Console -> Firestore Database -> Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow anyone to read events
    // Allow anyone to create/update events (For Development)
    match /events/{eventId} {
      allow read: if true;
      allow write: if true;
    }

    // Default rule for other collections (Optional)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> **Security Note:** For production, change `allow write: if true;` to `allow write: if request.auth != null;` to ensure only logged-in users can post.

---

## 2. Storage Rules

Go to **Firebase Console -> Storage -> Rules** and paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Allow anyone to view and upload event posters
    match /event-posters/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }

    // Default rule (Optional)
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

> **Important:** These rules are set to **public** for development ease. Before launching, ensure you add authentication checks.
