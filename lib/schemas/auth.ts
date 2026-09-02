import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요")
  .email("올바른 이메일 형식이 아닙니다");

// 불변 규칙(PRD.md FR-A03): 6자 이상이면 통과. 복잡도 정규식(.regex)을 추가하지 않는다 —
// 백엔드의 @Size(min = 6)과 정확히 일치시킨다.
export const passwordSchema = z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다");

export const nicknameSchema = z
  .string()
  .min(1, "닉네임을 입력해주세요")
  .max(50, "닉네임은 50자 이내로 입력해주세요");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nickname: nicknameSchema,
});

export type SignupFormValues = z.infer<typeof signupSchema>;
