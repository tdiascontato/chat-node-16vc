import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      uid: 'usr_abc123423',
      name: 'Joe Joe',
      email: 'joe@email.com',
    }
  });

  const user2 = await prisma.user.create({
    data: {
      uid: 'usr_def4543256',
      name: 'Alice Perdida',
      email: 'alice@perdida.com',
    }
  });

  const conversation = await prisma.conversation.create({
    data: {
      is_ai: false,
      userId: user1.id
    }
  });

  await prisma.message.createMany({
    data: [
      {
        text: 'Olá, como vai você?',
        senderId: user1.id,
        conversationId: conversation.id
      },
      {
        text: 'Estou bem, obrigado! E você?',
        senderId: user2.id,
        conversationId: conversation.id
      }
    ]
  });

  console.log('Seed completado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });