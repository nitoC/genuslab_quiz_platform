"use client";

import CustomInput from "@/components/ui/FormItems/CustomInput";
import PasswordInput from "@/components/ui/FormItems/PasswordInput";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/apis";
import { toast } from "react-toastify";
import { useUser } from "@/store/useUser";

const LoginPage = () => {
  const router = useRouter();
  const user = useUser((state: any) => state.updateUser);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const validate = (): boolean => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    // Simple regex check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (!form.password) {
      toast.error("Password is required");
      return false;
    }
    // Example: require at least 6 characters
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      // const respToken = await tokenUser({
      //   email: form.email,
      // });

      // const resp = await loginUser({
      //   api_key: respToken?.data,
      //   Password: form.password,
      // });
      const resp = await loginUser({
        email: form.email,
        password: form.password,
      });
      console.log("Login response:", resp.data);
      if (resp?.data?.payload) {
        // const userData = resp.data.payload;
        // delete userData.accessToken;
        // localStorage.setItem("user", JSON.stringify(userData));
        console.log("User payload:", resp.data.payload);
        user(resp.data.payload);
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
      // if (resp?.data === "Oh no way!") {
      //   toast.error("Invalid login details");
      //   setLoading(false);
      //   return;
      // }
      // if (resp?.data.length && resp?.data.length > 0) {
      //   sessionStorage.setItem("user", JSON.stringify(resp?.data[0]));
      //   user(resp?.data[0]);
      //   toast.success("Logged in successfully");
      //   router.push("/dashboard");
      // } else {
      //   toast.error(resp?.data || "Login failed");
      // }
    } catch (error) {
      console.error(error);
      console.log((error as any)?.response?.data);
      toast.error(
        error instanceof Error ? error.message : "Login failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-blue px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:flex-row">
          <div className="relative hidden sm:block sm:h-96 lg:flex-1 lg:min-h-[720px]">
            <Image
              src="/images/hand-main.png"
              alt="Security Illustration"
              fill
              className="object-cover"
              priority
            />
            <Link
              href="/"
              className="absolute right-5 top-5 rounded-full bg-blue/80 px-4 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-blue"
            >
              Back to website →
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-16">
            <div className="w-full max-w-md text-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto my-8"
              />
              <div className="mb-10">
                <h1 className="mb-1 text-2xl font-semibold md:text-3xl">
                  Welcome Back!
                </h1>
                <p className="text-center">Please enter your login details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <CustomInput
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                />
                <PasswordInput
                  id="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, password: value }))
                  }
                  showRequirements={false}
                />

                <p className="mt-2 text-sm flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />
                    <span>Remember for 30 days</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue"
                  >
                    Forgot password?
                  </Link>
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-blue py-3 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-100 py-3 text-sm font-medium transition hover:bg-gray-200"
                >
                  <FcGoogle className="text-lg" />
                  Log in with Google
                </button>
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link className="text-blue" href={"/signup"}>
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
