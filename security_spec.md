# Security Spec: Samparka Firestore Security & Access Control

## 1. Data Invariants
1. **User Identity Isolation**: A user profile at `/profiles/{userId}` can only be read by anyone, but created/updated ONLY if `request.auth.uid == userId`. Users cannot elevate their own role to `admin` or modify `isAdmin`.
2. **Business Ownership**: A business document at `/businesses/{businessId}` can only be modified/deleted by its true `ownerId`. Verification status can only be modified by system administrators.
3. **Job Listing Integrity**: A job at `/jobs/{jobId}` must reference a valid business owned by `request.auth.uid`. Non-owners cannot update or delete jobs. Only admins or owners can change job publication status.
4. **Application Privacy**: Applications at `/applications/{applicationId}` contain sensitive applicant PII (phone, email, resume). Only the applicant (`applicantId == request.auth.uid`) or the business owner who created the associated job can read the application. Only the applicant can submit the application.
5. **Saved Jobs Isolation**: `/saved_jobs/{savedJobId}` can only be read, created, or deleted by the user whose UID matches `userId`.
6. **Job Reports Moderation**: `/job_reports/{reportId}` can be created by any authenticated user, but can only be listed, read, or modified by verified administrators.
7. **Admin Fortress**: `/admins/{userId}` can only be managed by verified super administrators. The bootstrapped admin (`kiranhandi232@gmail.com`) has administrative oversight across moderation and verification.
8. **Catch-All Default Deny**: All unmapped paths are completely rejected.

## 2. The "Dirty Dozen" Threat Payloads (Must return PERMISSION_DENIED)
1. **Spoofed User Registration**: Attempting to set `isAdmin: true` or `userType: 'admin'` on profile creation by an unprivileged user.
2. **Cross-User Profile Hijacking**: User B attempting to write or overwrite `/profiles/{UserA_Id}`.
3. **Ghost Field Poisoning**: Inserting unexpected schema fields (e.g. `{ backdoorRole: 'superadmin' }`) into `/profiles/{userId}`.
4. **Unauthenticated Job Creation**: An unauthenticated request sending a write to `/jobs/{jobId}`.
5. **Job Hijacking**: User B attempting to update or archive a job posted by User A.
6. **Forged Business Verification**: An employer attempting to update `verificationStatus` from `'pending'` to `'verified'`.
7. **PII Application Snooping**: User C attempting to read applications submitted to a job owned by Business A.
8. **Application Forgery**: User B submitting a job application with `applicantId: 'UserA_Id'`.
9. **Arbitrary Status Tampering**: An applicant trying to change their application status from `'rejected'` to `'hired'`.
10. **Saved Jobs Interception**: User B querying or reading the saved jobs list of User A.
11. **Job Report Tampering**: A malicious user trying to read all safety reports at `/job_reports` or dismiss pending abuse flags.
12. **Admin Escalation**: An unauthorized user attempting to add themselves into `/admins/{myUid}`.
