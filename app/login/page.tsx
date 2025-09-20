import Link from 'next/link'
import { LoginForm } from '@/components/forms/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Connexion
            </CardTitle>
            <CardDescription className="text-center">
              Connectez-vous à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center space-y-2">
              <Link
                href="/"
                className="text-sm text-blue-600 hover:underline"
              >
                Retour à l'accueil
              </Link>
              <div className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-blue-600 hover:underline">
                  S'inscrire
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}