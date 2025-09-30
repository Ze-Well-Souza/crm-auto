import Stripe from 'stripe';

// Inicializar Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Endpoint secret para verificar a autenticidade dos webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verificar a assinatura do webhook
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Processar diferentes tipos de eventos
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      
      case 'payment_intent.requires_action':
        await handlePaymentRequiresAction(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Processar pagamento bem-sucedido
async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  try {
    // Extrair metadados do pagamento
    const { order_id, customer_name, customer_email } = paymentIntent.metadata;
    
    // Atualizar status da ordem de serviço no banco de dados
    // Em um ambiente real, você faria uma chamada para seu banco de dados
    await updateOrderPaymentStatus(order_id, 'paid', {
      payment_intent_id: paymentIntent.id,
      amount_received: paymentIntent.amount_received,
      payment_method: paymentIntent.payment_method_types[0],
      currency: paymentIntent.currency,
      receipt_email: paymentIntent.receipt_email || customer_email,
      created: paymentIntent.created,
    });
    
    // Enviar notificação para o cliente
    await sendPaymentConfirmationEmail(customer_email, {
      order_id,
      amount: paymentIntent.amount_received / 100, // Converter de centavos
      currency: paymentIntent.currency.toUpperCase(),
      payment_method: paymentIntent.payment_method_types[0],
    });
    
    // Enviar notificação interna
    await sendInternalNotification('payment_received', {
      order_id,
      customer_name,
      amount: paymentIntent.amount_received / 100,
      payment_intent_id: paymentIntent.id,
    });
    
    console.log(`Order ${order_id} payment confirmed successfully`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

// Processar pagamento falhado
async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  try {
    const { order_id, customer_email } = paymentIntent.metadata;
    
    // Atualizar status da ordem de serviço
    await updateOrderPaymentStatus(order_id, 'failed', {
      payment_intent_id: paymentIntent.id,
      failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
      failure_code: paymentIntent.last_payment_error?.code,
    });
    
    // Enviar notificação de falha para o cliente
    await sendPaymentFailureEmail(customer_email, {
      order_id,
      failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
    });
    
    console.log(`Order ${order_id} payment failed`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

// Processar pagamento cancelado
async function handlePaymentCanceled(paymentIntent) {
  console.log('Payment canceled:', paymentIntent.id);
  
  try {
    const { order_id } = paymentIntent.metadata;
    
    // Atualizar status da ordem de serviço
    await updateOrderPaymentStatus(order_id, 'cancelled', {
      payment_intent_id: paymentIntent.id,
      canceled_at: new Date().toISOString(),
    });
    
    console.log(`Order ${order_id} payment canceled`);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
    throw error;
  }
}

// Processar pagamento que requer ação
async function handlePaymentRequiresAction(paymentIntent) {
  console.log('Payment requires action:', paymentIntent.id);
  
  try {
    const { order_id } = paymentIntent.metadata;
    
    // Atualizar status da ordem de serviço
    await updateOrderPaymentStatus(order_id, 'pending', {
      payment_intent_id: paymentIntent.id,
      requires_action: true,
      next_action: paymentIntent.next_action,
    });
    
    console.log(`Order ${order_id} payment requires action`);
  } catch (error) {
    console.error('Error handling payment requires action:', error);
    throw error;
  }
}

// Função para atualizar status do pagamento da ordem
async function updateOrderPaymentStatus(orderId, status, paymentData) {
  // Em um ambiente real, você faria uma chamada para seu banco de dados
  // Exemplo com Supabase:
  /*
  const { error } = await supabase
    .from('service_orders')
    .update({
      payment_status: status,
      payment_data: paymentData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
  
  if (error) {
    throw new Error(`Failed to update order payment status: ${error.message}`);
  }
  */
  
  console.log(`Updated order ${orderId} payment status to ${status}`, paymentData);
}

// Função para enviar email de confirmação de pagamento
async function sendPaymentConfirmationEmail(email, paymentData) {
  // Em um ambiente real, você usaria um serviço de email como SendGrid, Mailgun, etc.
  console.log(`Sending payment confirmation email to ${email}`, paymentData);
  
  // Exemplo de implementação:
  /*
  const emailContent = {
    to: email,
    subject: `Pagamento Confirmado - Ordem ${paymentData.order_id}`,
    html: `
      <h2>Pagamento Confirmado!</h2>
      <p>Seu pagamento para a Ordem de Serviço #${paymentData.order_id} foi processado com sucesso.</p>
      <p><strong>Valor:</strong> ${paymentData.currency} ${paymentData.amount}</p>
      <p><strong>Método:</strong> ${paymentData.payment_method}</p>
      <p>Obrigado por escolher nossos serviços!</p>
    `,
  };
  
  await sendEmail(emailContent);
  */
}

// Função para enviar email de falha de pagamento
async function sendPaymentFailureEmail(email, failureData) {
  console.log(`Sending payment failure email to ${email}`, failureData);
  
  // Implementação similar ao email de confirmação
}

// Função para enviar notificação interna
async function sendInternalNotification(type, data) {
  console.log(`Sending internal notification: ${type}`, data);
  
  // Em um ambiente real, você poderia:
  // - Enviar para um canal Slack
  // - Criar uma notificação no sistema
  // - Enviar email para a equipe
  // - Atualizar dashboard em tempo real
}