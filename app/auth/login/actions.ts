'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getURL } from '@/utils/getURL'
import { createClient } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'

export async function emailLogin(formData: FormData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.log('cannot authenticate user')
        redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/todos')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/login?message=Error signing up')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard/client-dashboard')
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login')
}

export async function oAuthSignIn(provider: Provider) {
    if (!provider) {
        console.log('cannot authenticate user (provider')
        return redirect('/login?message=No provider selected')
    }

    const supabase = await createClient();
    const redirectUrl = getURL("/auth/callback")
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
        }
    })

    if (error) {
        console.log('cannot authenticate user (oauth)')
        redirect('/login?message=Could not authenticate user')
    }

    return redirect(data.url)
}