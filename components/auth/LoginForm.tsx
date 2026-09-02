"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/lib/api/auth";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/errors";
import { authKeys } from "@/lib/query-keys";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface LoginFormProps {
  /** app/login/page.tsx가 ?error=oauth 쿼리로부터 넘겨준다(백엔드 OAuth2FailureHandler 리다이렉트). */
  oauthError?: boolean;
}

export function LoginForm({ oauthError = false }: LoginFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      // 저장할 토큰이 없다 — 쿠키는 서버가 Set-Cookie로 이미 심었다.
      // 헤더의 AuthMenu가 새 로그인 상태를 즉시 반영하도록 캐시만 무효화한다.
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      router.push("/todos");
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors) {
        fieldErrors.forEach(({ field, message }) => {
          form.setError(field as keyof LoginFormValues, { message });
        });
        return;
      }
      // LOGIN_FAILED는 계정 없음/비밀번호 불일치를 의도적으로 구분하지 않는다(API_SPEC.md).
      form.setError("root", {
        message: extractErrorMessage(err, "이메일 또는 비밀번호가 올바르지 않습니다"),
      });
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-sm text-muted-foreground">할 일을 이어서 관리해 보세요</p>
      </div>

      {oauthError && <ErrorMessage title="구글 로그인 실패" message="다시 시도해 주세요" />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="flex flex-col gap-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <ErrorMessage title="로그인 실패" message={form.formState.errors.root.message ?? ""} />
          )}
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">또는</span>
        <Separator className="flex-1" />
      </div>

      <GoogleLoginButton />

      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-foreground underline underline-offset-4">
          회원가입
        </Link>
      </p>
    </div>
  );
}
