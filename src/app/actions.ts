'use server'
import { MercadoPagoConfig , Preference } from 'mercadopago';

export async function createCheckoutSession(amount: number): Promise<string> {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string
    })

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'item-' + Date.now().toString(),
            title: "Producto ejemplo",
            quantity: 1,
            unit_price: amount,
            currency_id: "MXN"
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pending`,
        },
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
        auto_return: 'approved',
      }
    })

    return result.init_point
  } catch (error) {
    console.error('Error al crear la preferencia de pago', error)
    throw new Error('No se pudo crear la sesion de pago')
  }
}
