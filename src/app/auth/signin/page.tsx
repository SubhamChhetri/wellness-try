"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn, useSession } from "next-auth/react"
import Link from 'next/link'
import Image from "next/image"
import { LoaderCircle } from 'lucide-react'

const REDIRECT_URI = "/"

const SignIn: React.FC = () => {
    const router = useRouter()
    const query = useSearchParams()
    const { status } = useSession()


    const callbackUrl = query?.get('callbackUrl') || REDIRECT_URI

    const [formData, setFormData] = useState({ email: "email@email.com", password: "**********" })
    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setIsError(null)

        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        })

        setLoading(false)

        if (result?.error) {
            setIsError(result.error)
        } else {
            router.push(callbackUrl)
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/")
        }

    }, [status, router])



    return (
        <div >
            <div className="p-6">
                <h1 className="text-center text-3xl font-extrabold text-primary mb-8 mt-6">Welcome to <br /> Wellness</h1>

                <div className="flex justify-center mb-6">
                    <div >
                        {/* //replace this with image tag */}
                        <Image src="/placeholder.png" alt="Placeholder" className="w-44 h-36  " />
                    </div>
                </div>
                <div className="space-y-2">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-xs font-light text-[#89A6CD]" htmlFor="email">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="block w-full border border-[#89A6CD] rounded-lg px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-xs font-light text-[#89A6CD]" htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="block w-full border border-[#89A6CD] rounded-lg px-3 py-2" />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-primary-400 text-sm">Forgot Password</a>
                        </div>
                        {isError && (
                            <div className="text-red-500 text-sm mt-1">
                                {isError}
                            </div>
                        )}


                    </form>
                </div>


            </div>
            <div className="fixed mt-4  bottom-2 mb-4 w-full px-6">
                <button onClick={onSubmit} disabled={loading} className="w-full bg-primary font-semibold  text-white py-3 rounded-3xl flex items-center justify-center">
                    {loading ? (
                        <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Dont have an account? <Link href="/auth/register" className="text-primary font-medium">Register</Link>
                </p>

            </div>
        </div>
    )
}

export default SignIn

