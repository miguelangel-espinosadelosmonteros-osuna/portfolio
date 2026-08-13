'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import RoundedButton from '@/components/animations/roundedButton';

type ContactFormData = {
  subject: string;
  email: string;
  body: string;
};

const CONTACT_EMAIL = 'mike.espinosa1203@gmail.com';

export function ContactForm() {
  const form = useForm<ContactFormData>({
    mode: 'onBlur',
    defaultValues: {
      subject: '',
      email: '',
      body: ''
    }
  });

  const onSubmit = ({ subject, email, body }: ContactFormData) => {
    // encodeURIComponent y no URLSearchParams: este último codifica los
    // espacios como '+', que los clientes de correo muestran literalmente.
    const query = [
      `subject=${encodeURIComponent(subject)}`,
      `body=${encodeURIComponent(`${body}\r\n\r\nDe: ${email}`)}`
    ].join('&');
    window.location.href = `mailto:${CONTACT_EMAIL}?${query}`;
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="flex flex-col gap-12 lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            ¡Hablemos!
          </h2>
          <p className="text-foreground/70 max-w-lg text-lg sm:text-xl">
            Siempre estoy en busca de formas nuevas e innovadoras de aplicar mis habilidades.
          </p>
        </div>
        <div className="col-span-2">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              <FormField
                control={form.control}
                name="subject"
                rules={{
                  required: 'El asunto es obligatorio',
                  maxLength: { value: 120, message: 'Máximo 120 caracteres' }
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel className="text-xl">Asunto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="¿De qué quieres hablar?"
                        className="w-full rounded-xl bg-background text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Introduce un correo válido'
                  }
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel className="text-xl">Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded-xl bg-background text-foreground"
                        type="email"
                        placeholder="Tu correo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                rules={{
                  required: 'El mensaje es obligatorio',
                  minLength: {
                    value: 10,
                    message: 'Cuéntame un poco más (mínimo 10 caracteres)'
                  }
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel className="text-xl">Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full rounded-xl bg-background text-foreground"
                        placeholder="Escribe tu mensaje aquí..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <RoundedButton type="submit" disabled={form.formState.isSubmitting}>
                  Enviar
                </RoundedButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
