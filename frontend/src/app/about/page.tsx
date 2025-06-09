export default function AboutPage() {
  const stats = [
    { label: 'Jets in Fleet', value: '50+' },
    { label: 'Countries Served', value: '100+' },
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Years of Experience', value: '15+' },
  ];

  const team = [
    {
      name: 'Vinay Agrawal',
      role: 'CEO & Founder',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vinay&backgroundColor=b6e3f4',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 dark:from-blue-900/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                  About AI Jet Booking
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  We're revolutionizing private jet travel with AI-powered booking and personalized service. Our mission is to make luxury air travel accessible and seamless.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Impact
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            We've been at the forefront of private aviation, serving thousands of customers worldwide with our innovative approach to luxury travel.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-semibold text-gray-900 dark:text-white">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-blue-600">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Team section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Leadership
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Meet the visionary behind AI Jet Booking. Our founder combines expertise in aviation, technology, and customer service to deliver an exceptional experience.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-1 xl:grid-cols-1"
        >
          {team.map((person) => (
            <li key={person.name} className="flex flex-col items-center">
              <img
                className="aspect-[14/13] w-64 h-64 rounded-2xl object-cover"
                src={person.imageUrl}
                alt={person.name}
              />
              <h3 className="mt-6 text-2xl font-semibold leading-8 text-gray-900 dark:text-white">
                {person.name}
              </h3>
              <p className="text-xl leading-7 text-gray-600 dark:text-gray-300">{person.role}</p>
              <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                With a passion for innovation and luxury travel, Vinay founded AI Jet Booking to revolutionize the private aviation industry. His vision combines cutting-edge AI technology with unparalleled service to create a seamless booking experience for discerning travelers.
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Values section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Values
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            We're committed to excellence in everything we do, from customer service to environmental responsibility.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div className="relative pl-9">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg
                className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                  clipRule="evenodd"
                />
              </svg>
              Excellence
            </dt>
            <dd className="inline text-gray-600 dark:text-gray-300">
              . We strive for excellence in every aspect of our service, from aircraft maintenance to customer care.
            </dd>
          </div>
          <div className="relative pl-9">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg
                className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
              Innovation
            </dt>
            <dd className="inline text-gray-600 dark:text-gray-300">
              . We continuously innovate to provide the best possible experience for our customers.
            </dd>
          </div>
          <div className="relative pl-9">
            <dt className="inline font-semibold text-gray-900 dark:text-white">
              <svg
                className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
              Sustainability
            </dt>
            <dd className="inline text-gray-600 dark:text-gray-300">
              . We're committed to reducing our environmental impact through sustainable practices.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 