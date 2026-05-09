# Security Specification - FitCore AI

## Data Invariants
1. **User Ownership**: Every document in `/users/{userId}/**` must belong to the authenticated user where `request.auth.uid == userId`.
2. **Goal Integrity**: A goal must have a `title` and `userId`.
3. **Workout Integrity**: A workout must have a `date`, `title`, and `userId`.
4. **Log Integrity**: A log must have a `date` and `userId`.
5. **Immutable Fields**: `userId`, `createdAt`, and `uid` fields must not be changed after creation.
6. **Strict Types**: All fields must match their defined types in the blueprint.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a user profile with a different `uid` than the auth token.
2. **Ghost Fields**: Attempt to add `admin: true` to a user profile.
3. **Orphaned Goals**: Attempt to create a goal with a `userId` that doesn't match the path.
4. **Resource Poisoning**: Attempt to inject a 1MB string into the `displayName`.
5. **State Shortcutting**: Attempt to change a workout `userId` to someone else's.
6. **Temporal Attack**: Attempt to set a `createdAt` date in the future (non-server timestamp).
7. **Cross-User Read**: Attempt to read another user's goals.
8. **Invalid Enum**: Attempt to set `activityLevel` to "pro_athlete" (not in enum).
9. **Negative Values**: Attempt to set `weight` to -70.
10. **Shadow Update**: Attempt to update `createdAt` on a user profile.
11. **Query Scraping**: Attempt to list all users without an auth token.
12. **Type Poisoning**: Attempt to set `age` as a string instead of an integer.

## Test Runner (Logic)
- `PERMISSION_DENIED` for all unauthorized cross-user access.
- `PERMISSION_DENIED` for invalid schemas or types.
- `PERMISSION_DENIED` for modifying immutable fields.
