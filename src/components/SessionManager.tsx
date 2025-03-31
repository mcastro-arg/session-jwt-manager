
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Key, Shield, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const SessionManager = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'inactive' | 'active' | 'expired'>('inactive');

  // Simular la creación de sesión (en una app real, esto se conectaría a tu API de Express)
  const createSession = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Ingresa una clave API válida",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulación de respuesta - en implementación real, esto sería un fetch a tu API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
      setSessionId(mockSessionId);
      setSessionStatus('active');
      
      toast({
        title: "Sesión creada",
        description: `ID de sesión: ${mockSessionId}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error al crear sesión",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Simular verificación de sesión
  const verifySession = async () => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No hay ID de sesión para verificar",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);
    
    try {
      // Simulación de respuesta - en implementación real, esto sería un fetch a tu API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isValid = sessionStatus === 'active';
      
      toast({
        title: isValid ? "Sesión válida" : "Sesión inválida",
        description: isValid ? "La sesión está activa y es válida" : "La sesión ha expirado o es inválida",
        variant: isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error al verificar sesión",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  // Simular expiración de sesión
  const expireSession = () => {
    setSessionStatus('expired');
    toast({
      title: "Sesión expirada",
      description: "La sesión ha sido marcada como expirada",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestor de Sesiones</CardTitle>
          <CardDescription>
            Crea y verifica sesiones con tokens JWT
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Clave API
            </label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa tu clave API"
                className="flex-1"
              />
              <Button 
                onClick={createSession} 
                disabled={loading || !apiKey}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Crear Sesión
                  </>
                )}
              </Button>
            </div>
          </div>

          {sessionId && (
            <div className="pt-4 space-y-4 border-t">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">ID de Sesión</label>
                  <Badge variant={sessionStatus === 'active' ? "outline" : "destructive"}>
                    {sessionStatus === 'active' ? (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Activa
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        Expirada
                      </span>
                    )}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Input value={sessionId} readOnly className="font-mono text-sm flex-1" />
                  <Button variant="outline" onClick={expireSession}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={verifySession}
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verificar Sesión
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Las sesiones expiran después de 1 hora de inactividad
          </div>
        </CardFooter>
      </Card>

      <Alert>
        <AlertDescription className="text-sm text-muted-foreground">
          <p className="mb-2 font-semibold">Simulación de frontend</p>
          <p>Esta interfaz simula las operaciones que se realizarían con el backend Express. 
          En una implementación real, estas acciones se comunicarían con los endpoints de tu API.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SessionManager;
