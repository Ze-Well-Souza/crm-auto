import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  userName,
  resetLink,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Redefinição de senha - CRM Auto</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔐 Redefinição de Senha</Heading>
        
        <Text style={text}>
          Olá <strong>{userName}</strong>,
        </Text>

        <Text style={text}>
          Recebemos uma solicitação para redefinir a senha da sua conta no CRM Auto.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={resetLink}>
            Redefinir Senha
          </Button>
        </Section>

        <Text style={text}>
          Ou copie e cole este link no seu navegador:
        </Text>

        <Text style={linkText}>
          {resetLink}
        </Text>

        <Hr style={hr} />

        <Text style={warningText}>
          ⚠️ Este link expirará em 1 hora por motivos de segurança.
        </Text>

        <Text style={warningText}>
          Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá inalterada.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          <Link href="https://crmauto.com" style={footerLink}>
            CRM Auto
          </Link>
          <br />
          Sistema de Gestão Automotiva
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
}

const buttonContainer = {
  padding: '27px 48px',
}

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '14px 0',
}

const linkText = {
  color: '#5469d4',
  fontSize: '14px',
  textDecoration: 'underline',
  padding: '0 48px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
}

const warningText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 48px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
}

const footerLink = {
  color: '#5469d4',
  textDecoration: 'underline',
}
