
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, KeyRound, Send, FileText, RefreshCw, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SessionManager from '@/components/SessionManager';
import ApiTester from '@/components/ApiTester';

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Session JWT Manager</h1>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Server Active
            </span>
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="session">Session Manager</TabsTrigger>
            <TabsTrigger value="test">API Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Express JWT Session Manager</CardTitle>
                <CardDescription>
                  Gestiona sesiones JWT con Express y Redis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTitle className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    Funcionalidades principales
                  </AlertTitle>
                  <AlertDescription className="mt-3">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Recibe una clave por POST HTTPS</li>
                      <li>Se comunica con una API externa para obtener un token JWT</li>
                      <li>Obtiene configuraciones de estilo desde la API</li>
                      <li>Crea una sesión y la persiste en Redis</li>
                      <li>Devuelve un identificador de sesión con 1 hora de expiración</li>
                      <li>Valida el identificador en cada solicitud</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab("session")}
                >
                  Ir al gestor de sesiones
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="session">
            <SessionManager />
          </TabsContent>

          <TabsContent value="test">
            <ApiTester />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Session JWT Manager &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
