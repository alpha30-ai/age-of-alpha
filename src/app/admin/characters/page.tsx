import CharacterClient from './CharacterClient';
import prisma from '@/lib/prisma';

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">إدارة الشخصيات</h1>
        <p className="text-gray-400">إضافة وتعديل وحذف شخصيات عالم عهد ألفا.</p>
      </div>

      <CharacterClient initialCharacters={characters} />
    </div>
  );
}
