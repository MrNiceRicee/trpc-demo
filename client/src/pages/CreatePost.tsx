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

  // parse zod error format to separate field and message
  /*
    example error:
    [ { "code": "too_small", "minimum": 1, "type": "string", "inclusive": true, "message": "String must contain at least 1 character(s)", "path": [ "content" ] } ]

    example output:
    { content: 'String must contain at least 1 character(s)' }

    and then display JSX based on the error
  */
  const formatTRPCErrorMessage = (error: string) => {
    try {
      const parsedError = JSON.parse(error);
      const formattedError = parsedError.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      return formattedError as Record<string, string>;
    } catch (error) {
      return {};
    }
  };

  const displayError = (error: string) => {
    const errors = formatTRPCErrorMessage(error);
    return Object.keys(errors).map((key) => {
      return (
        <p key={key} className="text-red-500">
          {key}: {errors[key]}
        </p>
      );
    });
  };

  return (
    <div className="py-2">
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
            className={`block w-full rounded-md border ${
              content.length > 128 ? 'text-red-500' : 'text-zinc-800'
            } border-none bg-gradient-to-b from-stone-100 to-stone-200 px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-100`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <span
              className={`text-sm ${
                content.length > 128 ? 'text-red-500' : 'text-zinc-500'
              }`}
            >
              {content.length} / 128
            </span>
            <span
              className="ml-2 h-4 w-4 rounded-full"
              style={{
                background: `conic-gradient(
                hsl(0 0% 50%) 0% ${(content.length / 128) * 100}%,
                hsl(0 0% 80%) ${(content.length / 128) * 100}% 100%
              )`,
              }}
            ></span>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-stone-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-100"
          >
            Create Post
          </button>
        </div>
      </form>
      <div
        className={`
        rounded-md bg-gradient-to-r from-red-400 to-red-100 p-1 font-mono
        ${createPost.error ? 'block' : 'hidden'}`}
      >
        <div className="flex items-center justify-between rounded-sm bg-white/80 p-2 bg-blend-color-dodge">
          {createPost.error && displayError(createPost.error.message)}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
