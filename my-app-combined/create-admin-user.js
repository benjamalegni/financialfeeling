// Script para crear cuenta admin en Supabase
// Ejecutar con: node create-admin-user.js

const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase (usar las mismas claves que en config.ts)
const supabaseUrl = 'https://yhxdyndkdhhnuginaekn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@financialfeeling.com',
      password: 'benjamin',
    })

    if (error) {
      console.error('Error creating admin user:', error)
      return
    }

    if (data.user) {
      console.log('Admin user created successfully!')
      console.log('User ID:', data.user.id)
      console.log('Email:', data.user.email)
      console.log('You can now sign in with:')
      console.log('Email: admin@financialfeeling.com')
      console.log('Password: benjamin')
    } else {
      console.log('No user data returned')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Ejecutar el script
createAdminUser() 