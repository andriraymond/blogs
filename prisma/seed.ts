import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@admin' },
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create default admin user
    const hashedPassword = await hashPassword('admin')
    const admin = await prisma.user.create({
      data: {
        email: 'admin@admin',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      },
    })

    console.log('Admin user created:', admin.email)
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
