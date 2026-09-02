"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signup } from "@/lib/api/auth";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/errors";
import { authKeys } from "@/lib/query-keys";
import { signupSchema, type SignupFormValues } from "@/lib/schemas/auth";
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

export function SignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", nickname: "" },
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      // API_SPEC.md: 가입 즉시 로그인 상태(쿠키 발급). 로그인과 동일하게 /todos로 이동한다.
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      router.push("/todos");
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors) {
        fieldErrors.forEach(({ field, message }) => {
          form.setError(field as keyof SignupFormValues, { message });
        });
        return;
      }
      // 필드 매핑되지 않는 실패(EMAIL_DUPLICATED 등)는 폼 전체 에러로 표시한다.
      form.setError("root", { message: extractErrorMessage(err) });
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold">회원가입</h1>
        <p className="text-sm text-muted-foreground">이메일로 가입하고 바로 시작하세요</p>
      </div>

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
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input autoComplete="nickname" {...field} />
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
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <ErrorMessage title="가입 실패" message={form.formState.errors.root.message ?? ""} />
          )}
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "가입 중..." : "회원가입"}
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
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          로그인
        </Link>
      </p>
    </div>
  );
}
