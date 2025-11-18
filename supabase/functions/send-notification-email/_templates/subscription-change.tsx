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

interface SubscriptionChangeProps {
  clientName: string
  changeType: 'upgrade' | 'downgrade' | 'cancelled' | 'renewed'
  oldPlan: string
  newPlan: string
  effectiveDate: string
  newPrice?: number
  features?: string[]
}

export const SubscriptionChange = ({
  clientName,
  changeType,
  oldPlan,
  newPlan,
  effectiveDate,
  newPrice,
  features,
}: SubscriptionChangeProps) => {
  const getTitle = () => {
    switch (changeType) {
      case 'upgrade':
        return 'Parabéns pelo Upgrade! 🎉'
      case 'downgrade':
        return 'Alteração de Plano Confirmada'
      case 'cancelled':
        return 'Cancelamento de Assinatura'
      case 'renewed':
        return 'Assinatura Renovada! ✅'
      default:
        return 'Alteração de Assinatura'
    }
  }

  const getMessage = () => {
    switch (changeType) {
      case 'upgrade':
        return `Você acabou de fazer upgrade do plano ${oldPlan} para ${newPlan}. Parabéns pela decisão de crescer conosco!`
      case 'downgrade':
        return `Seu plano será alterado de ${oldPlan} para ${newPlan} a partir de ${effectiveDate}.`
      case 'cancelled':
        return `Sua assinatura do plano ${oldPlan} foi cancelada e permanecerá ativa até ${effectiveDate}.`
      case 'renewed':
        return `Sua assinatura do plano ${newPlan} foi renovada com sucesso!`
      default:
        return `Seu plano foi alterado de ${oldPlan} para ${newPlan}.`
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{getTitle()} - CRM Auto</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{getTitle()}</Heading>
          
          <Text style={text}>Olá {clientName},</Text>
          
          <Text style={text}>{getMessage()}</Text>

          <Section style={detailsBox}>
            {changeType !== 'cancelled' && (
              <>
                <Text style={detailLabel}>Novo Plano:</Text>
                <Text style={{ ...detailValue, fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {newPlan}
                </Text>
              </>
            )}
            
            {changeType !== 'renewed' && (
              <>
                <Text style={detailLabel}>
                  {changeType === 'cancelled' ? 'Plano Atual:' : 'Plano Anterior:'}
                </Text>
                <Text style={detailValue}>{oldPlan}</Text>
              </>
            )}
            
            <Text style={detailLabel}>Data de Vigência:</Text>
            <Text style={detailValue}>{effectiveDate}</Text>
            
            {newPrice && (
              <>
                <Text style={detailLabel}>Novo Valor:</Text>
                <Text style={detailValue}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(newPrice)}
                  /mês
                </Text>
              </>
            )}
          </Section>

          {features && features.length > 0 && changeType !== 'cancelled' && (
            <Section style={featuresBox}>
              <Text style={featuresTitle}>Recursos Incluídos:</Text>
              {features.map((feature, index) => (
                <Text key={index} style={featureItem}>
                  ✓ {feature}
                </Text>
              ))}
            </Section>
          )}

          {changeType === 'cancelled' && (
            <Text style={text}>
              Sentiremos sua falta! Se houver algo que possamos fazer para melhorar, 
              não hesite em entrar em contato.
            </Text>
          )}

          {changeType !== 'cancelled' && (
            <Text style={text}>
              <Link href="https://app.crmautoshop.com/planos" style={link}>
                Acesse seu painel
              </Link>{' '}
              para ver todos os detalhes da sua assinatura.
            </Text>
          )}

          <Text style={footer}>
            {changeType === 'cancelled' ? 'Até breve!' : 'Obrigado pela confiança!'}
            <br />
            Equipe CRM Auto
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default SubscriptionChange

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

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
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

const featuresBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
}

const featuresTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const featureItem = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 40px',
}
