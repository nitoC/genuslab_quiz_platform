"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import CustomInput from "@/components/ui/FormItems/CustomInput";
import CustomDropdown from "@/components/ui/FormItems/CustomSelect";
import CustomDatePicker from "@/components/ui/FormItems/CustomDatePicker";
import { toast } from "react-toastify";
import { getOtp, registerUser } from "@/lib/api/apis";
import { useRouter, useSearchParams } from "next/navigation";

function SignUpPage() {
  const query = useSearchParams();
  const refCode = query.get("ref");
  const Router = useRouter();
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const [agree, setAgree] = useState(false);
  const [gender, setGender] = useState("");
  const [marketing, setMarketing] = useState("");
  const [dob, setDob] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    fullname: "",
    password: "",
    email: "",
    phone: "",
    refCode: refCode ? refCode : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Phone input filtering logic
    if (id === "phone") {
      const phoneRegex = /^\+?[0-9]*$/;

      // Allow only "+" once at the start, followed by digits
      if (!phoneRegex.test(value)) {
        return; // invalid input, ignore
      }

      // Optional: enforce "+" at the start and a length limit
      if (value.length > 15) return;

      setUser((prev) => ({
        ...prev,
        phone: value,
      }));
      return;
    }

    // Default for all other inputs
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateInputs = (): boolean => {
    const phoneRegex = /^\+[1-9]\d{10,14}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[\p{L}\s'-]+$/u;
    const refCodeRegex = /^[A-Za-z0-9-]*$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^()[\]{}])[A-Za-z\d@$!%*?#&^()[\]{}]{6,}$/;

    if (!user.fullname.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!nameRegex.test(user.fullname) || user.fullname.length > 50) {
      toast.error("Full name must be alphabetic and under 50 characters");
      return false;
    }

    if (!user.password) {
      toast.error("Password is required");
      return false;
    }

    if (!passwordRegex.test(user.password)) {
      toast.error(
        "Password must be at least 6 characters long, include uppercase, lowercase, number, and a special character",
      );
      return false;
    }

    if (!user.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!emailRegex.test(user.email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (user.email.length > 50) {
      toast.error("Email must be under 50 characters");
      return false;
    }

    if (!user.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!phoneRegex.test(user.phone)) {
      toast.error("Phone must start with '+' and include country code");
      return false;
    }

    if (user.refCode && !refCodeRegex.test(user.refCode)) {
      toast.error("Referral code must be alphanumeric only");
      return false;
    }

    if (!dob) {
      toast.error("Date of birth is required");
      return false;
    }

    if (!gender) {
      toast.error("Please select your gender");
      return false;
    }

    if (!marketing) {
      toast.error("Please tell us how you heard about us");
      return false;
    }

    if (!agree) {
      toast.error("You must agree to the Terms & Conditions");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (loading) return;
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const { password, ...restUser } = user;
      // const payload = {
      //   ...restUser,
      //   Password: password,
      //   Dob: new Date(dob as Date).toLocaleDateString("en-CA"), // Format as YYYY-MM-DD
      //   gender,
      //   hdyhau: marketing,
      // };
      const payload = {
        password,
        email: user.email,
        name: user.fullname,
        phone: user.phone,
        gender,
        dob: new Date(dob as Date).toLocaleDateString("en-CA"),
        referrerCode: refCode ? refCode : user.refCode,
        referrer: marketing,
      };
      // Format as YYYY-MM
      // console.log(payload, "registration payload");
      // toast.success("Account created successfully");
      const response = await registerUser(payload);
      console.log(response, "registration response");
      if (response.data.status === "success") {
        localStorage.setItem("user", JSON.stringify(response.data.payload));
        toast.success("Account created successfully");
        // await getO(payload.email, "email");

        Router.push("/verify");
      } else {
        toast.error((response as any).message || "Registration failed");
      }
    } catch (err: any) {
      console.error(err?.response?.data);
      if (err?.response?.data?.statusCode === 409) {
        return toast.error("user already exists. login");
      }
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:flex-row">
          {/* Left / Image */}
          <div className="relative hidden sm:block sm:h-96 lg:flex-1 lg:min-h-[720px]">
            <Image
              src="/images/signup.png"
              alt="Signup illustration"
              fill
              className="object-cover"
              priority
            />
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="absolute left-5 top-5"
            />
            <Link
              href="/"
              className="absolute right-5 top-5 rounded-full bg-blue/70 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-blue"
            >
              Back to website →
            </Link>
          </div>

          {/* Right / Form */}
          <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-16">
            <div className="w-full max-w-md">
              <h1 className="text-4xl font-semibold">Create an account</h1>
              <p className="mt-2 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue">
                  Log in
                </Link>
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
                className="mt-10 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <CustomInput
                    id="fullname"
                    placeholder="FullName"
                    onChange={handleChange}
                    value={user.fullname}
                  />
                  <CustomInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={user.password}
                  />
                </div>

                <CustomInput
                  type="email"
                  id="email"
                  onChange={handleChange}
                  placeholder="Email"
                  value={user.email}
                />

                <CustomInput
                  type="tel"
                  id="phone"
                  onChange={handleChange}
                  placeholder="Phone Number (+2348012345678)"
                  value={user.phone}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="relative w-full">
                    <div className="relative w-full rounded-sm border border-blue-300 text-sm transition focus-within:outline-blue-10 focus-within:outline-500/10">
                      <CustomDatePicker
                        value={dob}
                        onChange={(date) => {
                          setDob(date as Date);
                        }}
                        placeholder="Date of Birth"
                      />
                      <FaCalendarAlt className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  <CustomDropdown
                    id="gender"
                    placeholder="Gender"
                    label={gender}
                    onChange={(val: any) => setGender(val)}
                    options={[
                      { label: "Female", value: "female" },
                      { label: "Male", value: "male" },
                      { label: "Other", value: "other" },
                    ]}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <CustomDropdown
                    id="marketing"
                    placeholder="How did you hear about us?"
                    label={marketing}
                    onChange={(val: any) => setMarketing(val)}
                    options={[
                      { label: "Friend/Colleague", value: "friend" },
                      { label: "Facebook", value: "facebook" },
                      { label: "Instagram", value: "instagram" },
                      { label: "Twitter", value: "twitter" },
                      { label: "Google", value: "google" },
                      { label: "Ad / Online Search", value: "ad" },
                    ]}
                  />
                  <CustomInput
                    id="refCode"
                    placeholder="Referral Code (Optional)"
                    onChange={handleChange}
                    disabled={refCode}
                    value={refCode ? refCode : user.refCode}
                  />
                </div>

                <label className="flex items-center gap-3 text-xs">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-primary">
                      Terms&nbsp;&amp;&nbsp;Condition
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!agree || loading}
                  className="w-full rounded-md bg-blue py-3 font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-100 py-3 text-sm font-medium transition hover:bg-gray-200"
                >
                  <FcGoogle className="text-lg" />
                  Log in with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const SuspenseWrapper = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <SignUpPage />
    </Suspense>
  );
};

export default SuspenseWrapper;
