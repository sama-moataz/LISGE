module.exports = {

"[externals]/firebase-admin [external] (firebase-admin, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[project]/src/lib/firebaseAdmin.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/firebaseAdmin.ts
__turbopack_context__.s({
    "adminAuth": (()=>adminAuth),
    "adminDB": (()=>adminDB)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
;
// THIS IS THE NEW LOGGING LINE:
console.log("[firebaseAdmin.ts] SERVER START: Current value of process.env.GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS || "NOT SET");
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let adminDBInstance;
let adminAuthInstance;
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].apps.length) {
    if (!serviceAccountPath) {
        console.warn('WARNING: GOOGLE_APPLICATION_CREDENTIALS environment variable is NOT SET. ' + 'Firebase Admin SDK will attempt to initialize with application default credentials. ' + 'This might only work in specific Google Cloud environments (e.g., Cloud Functions, App Engine). ' + 'For local development and most other deployments, you MUST provide a service account JSON file path via this variable.');
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].initializeApp();
            console.log('Firebase Admin SDK: Initialized with application default credentials.');
        } catch (e) {
            console.error('Firebase Admin SDK: CRITICAL - Initialization FAILED with default credentials:', e.message);
            console.error('Firebase Admin SDK: Ensure your environment is set up for default credentials or set GOOGLE_APPLICATION_CREDENTIALS.');
        }
    } else {
        console.log('Firebase Admin SDK: GOOGLE_APPLICATION_CREDENTIALS is SET. Path from env var:', serviceAccountPath);
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].initializeApp({
                credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].credential.cert(serviceAccountPath)
            });
            console.log('Firebase Admin SDK: Initialized successfully with service account from path:', serviceAccountPath);
        } catch (e) {
            console.error('Firebase Admin SDK: CRITICAL - Initialization FAILED with service account. Path used:', serviceAccountPath, 'Error:', e.message);
            console.error('Firebase Admin SDK: Ensure the GOOGLE_APPLICATION_CREDENTIALS path is correct, the file exists, is valid JSON, and the Node.js process has read permissions.');
        }
    }
    // Verify initialization and attempt to get instances
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].apps.length > 0) {
        try {
            adminDBInstance = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].firestore();
            adminAuthInstance = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].auth();
            if (adminDBInstance && adminAuthInstance) {
                console.log('Firebase Admin SDK: Successfully retrieved Firestore and Auth instances. Admin SDK should be operational.');
            } else {
                console.error('Firebase Admin SDK: CRITICAL - admin.firestore() or admin.auth() returned undefined/null even after app initialization. This is unexpected.');
            }
        } catch (e) {
            console.error('Firebase Admin SDK: CRITICAL - Error when trying to get Firestore/Auth instance after app initialization:', e.message);
        }
    } else {
        console.error('Firebase Admin SDK: CRITICAL - admin.apps.length is 0. Initialization definitely failed.');
    }
} else {
    console.log('Firebase Admin SDK: Already initialized (admin.apps.length > 0). Retrieving existing instances.');
    // This block executes if the SDK was initialized elsewhere or in a previous hot reload cycle.
    // It's generally safer to ensure instances are always freshly retrieved from the default app if available.
    try {
        if (!adminDBInstance) adminDBInstance = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].firestore();
        if (!adminAuthInstance) adminAuthInstance = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].auth();
        if (adminDBInstance && adminAuthInstance) {
            console.log('Firebase Admin SDK: Re-confirmed Firestore and Auth instances from existing app.');
        }
    } catch (e) {
        console.error('Firebase Admin SDK: Error retrieving instances from existing app:', e.message);
    }
}
const adminDB = adminDBInstance;
const adminAuth = adminAuthInstance;
}}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/firestoreAdminService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// src/lib/firestoreAdminService.ts
__turbopack_context__.s({
    "addScholarshipAdmin": (()=>addScholarshipAdmin),
    "deleteScholarshipAdmin": (()=>deleteScholarshipAdmin),
    "updateScholarshipAdmin": (()=>updateScholarshipAdmin)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebaseAdmin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
const SCHOLARSHIPS_COLLECTION = 'SCHOLARSHIPS';
function ensureAdminDBInitialized() {
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminDB"] === 'undefined' || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminDB"] || typeof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminDB"].collection !== 'function') {
        const errorMessage = "SERVER_CONFIG_ERROR: Firebase Admin SDK (adminDB) is not properly initialized. This is a critical server configuration issue. Possible causes: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set, path is incorrect, service account file is malformed/missing, or Node.js process lacks read permissions. Detailed Admin SDK initialization logs should be in the server console (check firebaseAdmin.ts logs).";
        console.error("[firestoreAdminService] CRITICAL CHECK FAILED:", errorMessage);
        throw new Error(errorMessage);
    }
    console.log("[firestoreAdminService] AdminDB initialized check passed.");
}
async function addScholarshipAdmin(scholarshipData) {
    console.log("[firestoreAdminService] addScholarshipAdmin: Attempting to add data:", JSON.stringify(scholarshipData, null, 2));
    ensureAdminDBInitialized(); // Explicit check
    const dataToSave = {
        name: scholarshipData.name || '',
        description: scholarshipData.description || '',
        eligibility: scholarshipData.eligibility || '',
        websiteUrl: scholarshipData.websiteUrl || '',
        location: scholarshipData.location || 'International',
        iconName: scholarshipData.iconName && scholarshipData.iconName !== '_none_' ? scholarshipData.iconName : null,
        category: scholarshipData.category || null,
        ageRequirement: scholarshipData.ageRequirement && scholarshipData.ageRequirement !== '_none_' ? scholarshipData.ageRequirement : null,
        fundingLevel: scholarshipData.fundingLevel && scholarshipData.fundingLevel !== '_none_' ? scholarshipData.fundingLevel : null,
        destinationRegion: scholarshipData.destinationRegion && scholarshipData.destinationRegion !== '_none_' ? scholarshipData.destinationRegion : null,
        targetLevel: scholarshipData.targetLevel && scholarshipData.targetLevel !== '_none_' ? scholarshipData.targetLevel : null,
        fundingCountry: scholarshipData.fundingCountry && scholarshipData.fundingCountry !== '_none_' ? scholarshipData.fundingCountry : null,
        partner: scholarshipData.partner || null,
        coverage: scholarshipData.coverage || null,
        deadline: scholarshipData.deadline || null,
        imageUrl: scholarshipData.imageUrl || null,
        createdAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now(),
        updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now()
    };
    try {
        const scholarshipsRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminDB"].collection(SCHOLARSHIPS_COLLECTION); // Added non-null assertion as ensureAdminDBInitialized would have thrown
        const docRef = await scholarshipsRef.add(dataToSave);
        console.log("[firestoreAdminService] addScholarshipAdmin: Successfully added document with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("[firestoreAdminService] addScholarshipAdmin: CRITICAL ERROR during Admin SDK Firestore 'add' operation:", error);
        throw new Error(`Admin SDK Firestore Error: ${error.message || 'Failed to add scholarship using Admin SDK. Check server console for details.'}`);
    }
}
async function updateScholarshipAdmin(id, scholarshipData) {
    console.log(`[firestoreAdminService] updateScholarshipAdmin: Attempting to update ID ${id} with data:`, JSON.stringify(scholarshipData, null, 2));
    ensureAdminDBInitialized();
    const dataToUpdate = {};
    Object.keys(scholarshipData).forEach((key)=>{
        const value = scholarshipData[key];
        if (value === undefined || value === null || value === '_none_') {
            dataToUpdate[key] = null;
        } else if (typeof value === 'string' && value.trim() === '' && (key === 'imageUrl' || key === 'iconName' || key === 'category' || key === 'ageRequirement' || key === 'fundingLevel' || key === 'destinationRegion' || key === 'targetLevel' || key === 'fundingCountry' || key === 'partner' || key === 'coverage' || key === 'deadline')) {
            dataToUpdate[key] = null;
        } else {
            dataToUpdate[key] = value;
        }
    });
    dataToUpdate.updatedAt = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now();
    try {
        const scholarshipDocRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminDB"].collection(SCHOLARSHIPS_COLLECTION).doc(id);
        await scholarshipDocRef.update(dataToUpdate);
        console.log(`[firestoreAdminService] updateScholarshipAdmin: Successfully updated document with ID: ${id}`);
    } catch (error) {
        console.error(`[firestoreAdminService] updateScholarshipAdmin: ERROR updating scholarship ${id} with Admin SDK:`, error);
        throw new Error(`Admin SDK Firestore Error: ${error.message || `Failed to update scholarship ${id}. Check server console.`}`);
    }
}
async function deleteScholarshipAdmin(id) {
    console.log(`[firestoreAdminService] deleteScholarshipAdmin: Attempting to delete ID: ${id}`);
    ensureAdminDBInitialized();
    try {
        const scholarshipDocRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminDB"].collection(SCHOLARSHIPS_COLLECTION).doc(id);
        await scholarshipDocRef.delete();
        console.log(`[firestoreAdminService] deleteScholarshipAdmin: Successfully deleted document with ID: ${id}`);
    } catch (error) {
        console.error(`[firestoreAdminService] deleteScholarshipAdmin: Error deleting scholarship ${id} with Admin SDK:`, error);
        throw new Error(`Admin SDK Firestore Error: ${error.message || `Failed to delete scholarship ${id}. Check server console.`}`);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/* __next_internal_action_entry_do_not_use__ [{"40037e7ff8ae96661e5144367a12d348a43a9581d7":"handleAddScholarshipAction","6078df80afe875f0715264ab2c1dfd262c62d64c73":"handleDeleteScholarshipAction","608851fee37b32becd29a2a7331415c792c1d7790a":"handleUpdateScholarshipAction"},"",""] */ __turbopack_context__.s({
    "handleAddScholarshipAction": (()=>handleAddScholarshipAction),
    "handleDeleteScholarshipAction": (()=>handleDeleteScholarshipAction),
    "handleUpdateScholarshipAction": (()=>handleUpdateScholarshipAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestoreAdminService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firestoreAdminService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestoreAdminService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestoreAdminService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
// Authorization check placeholder - implement robust checks before production
async function verifyAdminPrivileges(actionName) {
    // In a real app, verify the user's ID token and check their role (e.g., from Firestore custom claims).
    // Example:
    // const { headers } = await import('next/headers');
    // const idToken = headers().get('Authorization')?.split('Bearer ')[1];
    // if (!idToken) throw new Error(`[Server Action Auth - ${actionName}] Unauthorized: No token provided`);
    // const { adminAuth } = await import('@/lib/firebaseAdmin');
    // if (!adminAuth) throw new Error(`[Server Action Auth - ${actionName}] Admin Auth not initialized`);
    // try {
    //   const decodedToken = await adminAuth.verifyIdToken(idToken);
    //   const userRecord = await adminAuth.getUser(decodedToken.uid);
    //   if (userRecord.customClaims?.role !== 'Admin') {
    //     throw new Error(`[Server Action Auth - ${actionName}] Unauthorized: User is not an admin`);
    //   }
    //   console.log(`[Server Action Auth - ${actionName}] Admin privileges verified for UID:`, decodedToken.uid);
    // } catch (error: any) {
    //   console.error(`[Server Action Auth - ${actionName}] Admin verification failed:`, error.message);
    //   throw new Error(`[Server Action Auth - ${actionName}] Unauthorized: Admin verification failed.`);
    // }
    console.warn(`[Server Action - ${actionName}] Placeholder admin authorization check. Implement actual verification.`);
    return true; // Assume admin for now
}
async function handleAddScholarshipAction(data) {
    console.log('[Server Action - handleAddScholarshipAction] INVOKED.');
    console.log('[Server Action - handleAddScholarshipAction] GOOGLE_APPLICATION_CREDENTIALS (at start of Server Action):', process.env.GOOGLE_APPLICATION_CREDENTIALS || "NOT SET in Server Action environment");
    // await verifyAdminPrivileges('handleAddScholarshipAction'); // Uncomment and implement
    try {
        // Data is already processed by the client before being sent here
        console.log("[Server Action - handleAddScholarshipAction] Received processed data:", JSON.stringify(data, null, 2));
        const scholarshipId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestoreAdminService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addScholarshipAdmin"])(data);
        console.log("[Server Action - handleAddScholarshipAction] Scholarship added successfully with ID:", scholarshipId);
        return {
            success: true,
            scholarshipId,
            name: data.name
        };
    } catch (err) {
        console.error("[Server Action - handleAddScholarshipAction] CAUGHT ERROR while calling addScholarshipAdmin or during processing:", err);
        console.error("[Server Action - handleAddScholarshipAction] Error Name:", err.name);
        console.error("[Server Action - handleAddScholarshipAction] Error Message:", err.message);
        console.error("[Server Action - handleAddScholarshipAction] Error Stack:", err.stack);
        let clientErrorMessage = "Failed to add scholarship. An unexpected server error occurred.";
        if (err.message) {
            clientErrorMessage = err.message.includes("SERVER_CONFIG_ERROR:") ? err.message : `Failed to add scholarship: ${err.message}`;
        }
        return {
            success: false,
            error: clientErrorMessage,
            name: data.name
        };
    }
}
async function handleUpdateScholarshipAction(id, data) {
    console.log(`[Server Action - handleUpdateScholarshipAction] Received data for ID ${id}:`, data);
    // await verifyAdminPrivileges('handleUpdateScholarshipAction'); // Uncomment and implement
    try {
        // Data is already processed by the client
        console.log("[Server Action - handleUpdateScholarshipAction] Processed data for Admin SDK:", data);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestoreAdminService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateScholarshipAdmin"])(id, data);
        console.log("[Server Action - handleUpdateScholarshipAction] Scholarship updated for ID:", id);
        return {
            success: true,
            id,
            name: data.name
        };
    } catch (err) {
        console.error("[Server Action - handleUpdateScholarshipAction] Error calling updateScholarshipAdmin:", err);
        return {
            success: false,
            error: err.message || "Failed to update scholarship via Admin SDK.",
            name: data.name
        };
    }
}
async function handleDeleteScholarshipAction(id, name) {
    console.log(`[Server Action - handleDeleteScholarshipAction] Attempting to delete ID ${id}, Name: ${name}`);
    // await verifyAdminPrivileges('handleDeleteScholarshipAction'); // Uncomment and implement
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firestoreAdminService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteScholarshipAdmin"])(id);
        console.log(`[Server Action - handleDeleteScholarshipAction] Scholarship deleted for ID: ${id}`);
        return {
            success: true,
            name
        };
    } catch (err) {
        console.error(`[Server Action - handleDeleteScholarshipAction] Error calling deleteScholarshipAdmin for ID ${id}:`, err);
        return {
            success: false,
            error: err.message || "Failed to delete scholarship via Admin SDK.",
            name
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    handleAddScholarshipAction,
    handleUpdateScholarshipAction,
    handleDeleteScholarshipAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleAddScholarshipAction, "40037e7ff8ae96661e5144367a12d348a43a9581d7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleUpdateScholarshipAction, "608851fee37b32becd29a2a7331415c792c1d7790a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleDeleteScholarshipAction, "6078df80afe875f0715264ab2c1dfd262c62d64c73", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "40037e7ff8ae96661e5144367a12d348a43a9581d7": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleAddScholarshipAction"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "40037e7ff8ae96661e5144367a12d348a43a9581d7": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40037e7ff8ae96661e5144367a12d348a43a9581d7"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/scholarships/new/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/scholarships/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/admin/scholarships/new/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admin/scholarships/new/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admin/scholarships/new/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/admin/scholarships/new/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admin/scholarships/new/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admin/scholarships/new/page.tsx", "default");
}}),
"[project]/src/app/admin/scholarships/new/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/admin/scholarships/new/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/admin/scholarships/new/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$scholarships$2f$new$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/admin/scholarships/new/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/scholarships/new/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__0fc614cd._.js.map