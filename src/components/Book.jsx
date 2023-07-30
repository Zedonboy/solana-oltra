export default function Book({author_name, title, price}) {
  return (
    <div class="w-full bg-white">
      <figure className="w-full h-52">
        <img
          class="rounded-lg w-full h-full object-fill"
          src="/bookcover.jpg"
          alt=""
        />
      </figure>
      <div class="p-1">
        <a href="#">
          <h5 class=" text-sm font-bold tracking-tight text-gray-900">
            {title}
          </h5>
        </a>
        <p class="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400">
          {author_name}
        </p>
        {/* <div class="flex items-center">
          <svg
            aria-hidden="true"
            class="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Rating star</title>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <p class="text-xs font-bold">4.95</p>
        </div> */}
        <div className="flex justify-between items-center">
          <p className="text-xs">price</p>
          <p className="font-bold">{price}</p>
        </div>
      </div>
    </div>
  );
}
