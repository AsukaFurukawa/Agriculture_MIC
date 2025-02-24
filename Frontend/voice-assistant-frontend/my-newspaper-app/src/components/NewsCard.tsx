import React from 'react';

export default function NewsCard({ title, content }: { title: string, content: string }) {
  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p>{content}</p>
    </div>
  );
}
