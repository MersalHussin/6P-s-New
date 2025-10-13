
export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission errors.
 * It includes context about the request that was denied, which is
 * invaluable for debugging security rules.
 */
export class FirestorePermissionError extends Error {
    public context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(context, null, 2)}`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;

        // This is necessary for `instanceof` to work correctly in some environments
        Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    }
}

    
