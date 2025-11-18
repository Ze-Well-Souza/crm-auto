import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PaymentConfirmationProps {
  clientName: string
  amount: number
  paymentMethod: string
  orderNumber?: string
  description: string
  paymentDate: string
}

export const PaymentConfirmation = ({
  clientName,
  amount,
  paymentMethod,
  orderNumber,
  description,
  paymentDate,
}: PaymentConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Confirmação de Pagamento - CRM Auto</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Pagamento Confirmado! ✅</Heading>
        
        <Text style={text}>Olá {clientName},</Text>
        
        <Text style={text}>
          Recebemos seu pagamento com sucesso. Confira os detalhes abaixo:
        </Text>

        <Section style={detailsBox}>
          {orderNumber && (
            <>
              <Text style={detailLabel}>Ordem de Serviço:</Text>
              <Text style={detailValue}>{orderNumber}</Text>
            </>
          )}
          
          <Text style={detailLabel}>Descrição:</Text>
          <Text style={detailValue}>{description}</Text>
          
          <Text style={detailLabel}>Valor Pago:</Text>
          <Text style={{ ...detailValue, fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(amount)}
          </Text>
          
          <Text style={detailLabel}>Forma de Pagamento:</Text>
          <Text style={detailValue}>{paymentMethod}</Text>
          
          <Text style={detailLabel}>Data do Pagamento:</Text>
          <Text style={detailValue}>{paymentDate}</Text>
        </Section>

        <Text style={text}>
          Este email serve como comprovante de pagamento. Guarde-o para seus registros.
        </Text>

        <Text style={footer}>
          Obrigado pela preferência!<br />
          Equipe CRM Auto
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PaymentConfirmation

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
