import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AppointmentConfirmationProps {
  clientName: string
  appointmentDate: string
  appointmentTime: string
  serviceType: string
  vehicleInfo?: string
  estimatedPrice?: number
}

export const AppointmentConfirmation = ({
  clientName,
  appointmentDate,
  appointmentTime,
  serviceType,
  vehicleInfo,
  estimatedPrice,
}: AppointmentConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Confirmação de Agendamento - CRM Auto</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Agendamento Confirmado! 🚗</Heading>
        
        <Text style={text}>Olá {clientName},</Text>
        
        <Text style={text}>
          Seu agendamento foi confirmado com sucesso. Veja os detalhes abaixo:
        </Text>

        <Section style={detailsBox}>
          <Text style={detailLabel}>Data:</Text>
          <Text style={detailValue}>{appointmentDate}</Text>
          
          <Text style={detailLabel}>Horário:</Text>
          <Text style={detailValue}>{appointmentTime}</Text>
          
          <Text style={detailLabel}>Serviço:</Text>
          <Text style={detailValue}>{serviceType}</Text>
          
          {vehicleInfo && (
            <>
              <Text style={detailLabel}>Veículo:</Text>
              <Text style={detailValue}>{vehicleInfo}</Text>
            </>
          )}
          
          {estimatedPrice && (
            <>
              <Text style={detailLabel}>Valor Estimado:</Text>
              <Text style={detailValue}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(estimatedPrice)}
              </Text>
            </>
          )}
        </Section>

        <Text style={text}>
          Em caso de necessidade de reagendamento, entre em contato conosco com antecedência.
        </Text>

        <Text style={footer}>
          Atenciosamente,<br />
          Equipe CRM Auto
        </Text>
      </Container>
    </Body>
  </Html>
)

export default AppointmentConfirmation

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 40px',
}

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
}

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0 4px',
}

const detailValue = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0 0 16px',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 40px',
}
