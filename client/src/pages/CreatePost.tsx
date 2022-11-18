import { useState } from 'react';
import { trpc } from '../api/_trpc';

function CreatePost() {
  // grab form data from the form element
  const [content, setContent] = useState('');
  const ctx = trpc.useContext();
  const createPost = trpc.posts.createPost.useMutation({
    onSuccess: () => {
      ctx.posts.viewAll.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost.mutate({
      content,
    });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="content">new post</label>
          <textarea
            name="content"
            id="content"
            cols={40}
            rows={5}
            style={{
              boxShadow: `
            inset 0 1px 4px 0 hsl(0 0% 70%),
            inset 0 1px 0px 0px hsl(0 0% 50%),
            inset 0 -1px 0px 0px hsl(0 0% 80%)
          `,
            }}
            className="block w-full rounded-md border border-none bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-1 font-mono focus:ring-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="rounded-md bg-stone-200 p-2">
            Create Post
          </button>
        </div>
      </form>
      <div>
        {createPost.error && (
          <div className="text-red-500">{createPost.error.message}</div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
