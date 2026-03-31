// ─── Auth ─────────────────────────────────────────────────────────────
export interface AuthUserResponse {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly emailVerified: boolean;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;
}

export interface LoginResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthUserResponse;
  readonly sessionId: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

// ─── Users ────────────────────────────────────────────────────────────
export interface UserProfileResponse {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly avatarUrl: string | null;
  readonly phone: string | null;
  readonly location: string | null;
  readonly bio: string | null;
  readonly grade: string | null;
  readonly customStudentId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  grade?: string | null;
  customStudentId?: string | null;
}

// ─── Courses ──────────────────────────────────────────────────────────
export interface CourseResponse {
  readonly id: string;
  readonly tutorId: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly price: string;
  readonly passMark: string;
  readonly commissionRate: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly tutor?: {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
  };
}

export interface CreateCourseDto {
  title: string;
  description: string;
  price: number;
  passMark: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  price?: number;
  passMark?: number;
}

export interface ListCoursesDto {
  page?: number;
  pageSize?: number;
  status?: "DRAFT" | "PUBLISHED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  tutorId?: string;
  search?: string;
}

// ─── Sessions ─────────────────────────────────────────────────────────
export interface SessionResponse {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly scheduledAt: Date;
  readonly duration: number;
  readonly status: string;
  readonly getStreamCallId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateSessionDto {
  courseId: string;
  title: string;
  scheduledAt: Date;
  duration?: number;
  endTime?: Date;
}

// ─── Notes ────────────────────────────────────────────────────────────
export interface NoteResponse {
  readonly id: string;
  readonly courseId: string;
  readonly sessionId: string | null;
  readonly tutorId: string;
  readonly title: string;
  readonly s3Key: string;
  readonly downloadUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateNoteDto {
  courseId: string;
  sessionId?: string;
  title: string;
  s3Key: string;
}

// ─── Assessments ──────────────────────────────────────────────────────
export interface AssessmentResponse {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly type: string;
  readonly s3Key: string | null;
  readonly downloadUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface SubmissionResponse {
  readonly id: string;
  readonly assessmentId: string;
  readonly studentId: string;
  readonly s3Key: string;
  readonly downloadUrl?: string;
  readonly score: string | null;
  readonly feedback: string | null;
  readonly gradedAt: Date | null;
  readonly createdAt: Date;
}

export interface CreateAssessmentDto {
  courseId: string;
  title: string;
  type: "MODULE_QUIZ" | "ASSIGNMENT" | "FINAL_ASSESSMENT";
  s3Key?: string;
}

export interface SubmitAssessmentDto {
  s3Key: string;
}

export interface GradeSubmissionDto {
  score: number;
  feedback?: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────
export interface ConversationResponse {
  readonly id: string;
  readonly type: string;
  readonly courseId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly participants?: unknown[];
  readonly course?: unknown;
}

export interface MessageResponse {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly content: string;
  readonly createdAt: Date;
}

export interface CreateConversationDto {
  type: "DIRECT" | "COURSE" | "SUPPORT";
  courseId?: string;
  targetUserId?: string;
}

export interface SendMessageDto {
  content: string;
}

// ─── Media ────────────────────────────────────────────────────────────
export interface UploadUrlResult {
  readonly uploadUrl: string;
  readonly key: string;
}

export interface UploadUrlDto {
  prefix: string;
  contentType: string;
  fileName: string;
}

// ─── Calendar ─────────────────────────────────────────────────────────
export interface CalendarEventResponse {
  readonly id: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly title: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly createdAt: Date;
}

export interface CalendarQueryDto {
  startDate: Date;
  endDate: Date;
}

// ─── Payments ─────────────────────────────────────────────────────────
export interface TransactionResponse {
  readonly id: string;
  readonly enrollmentId: string;
  readonly userId: string;
  readonly courseId: string;
  readonly grossAmount: string;
  readonly platformFee: string;
  readonly tutorNetAmount: string;
  readonly currency: string;
  readonly providerTransactionId: string;
  readonly commissionRate: string;
  readonly createdAt: Date;
}

export interface ListTransactionsDto {
  page?: number;
  pageSize?: number;
}

export interface ConnectOnboardingDto {
  refreshUrl: string;
  returnUrl: string;
}

// ─── Certificates ─────────────────────────────────────────────────────
export interface CertificateResponse {
  readonly id: string;
  readonly studentId: string;
  readonly courseId: string;
  readonly status: string;
  readonly data: Record<string, unknown> | null;
  readonly certificateUid: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ─── Notifications ────────────────────────────────────────────────────
export interface NotificationResponse {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly createdAt: Date;
}

export interface RegisterPushTokenDto {
  token: string;
  platform: "android" | "ios" | "web";
}

// ─── Domains ──────────────────────────────────────────────────────────
export interface DomainResponse {
  readonly id: string;
  readonly userId: string;
  readonly subdomain: string;
  readonly status: string;
  readonly cloudflareDnsRecordId: string | null;
  readonly createdAt: Date;
}

// ─── Admin ────────────────────────────────────────────────────────────
export interface ApplicationResponse {
  readonly id: string;
  readonly userId: string;
  readonly status: string;
  readonly denialReason: string | null;
  readonly createdAt: Date;
  readonly user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AppConfigResponse {
  readonly key: string;
  readonly value: string;
  readonly updatedAt: Date;
}

export interface ApplicationActionDto {
  reason?: string;
}

export interface CreateConfigDto {
  key: string;
  value: string;
}

export interface UpdateConfigDto {
  key: string;
  value: string;
}

export interface DeleteConfigDto {
  key: string;
}

export interface AuditLogQueryDto {
  page?: number;
  pageSize?: number;
  actorId?: string;
  resourceType?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface FinancialSummaryQueryDto {
  startDate?: Date;
  endDate?: Date;
}
