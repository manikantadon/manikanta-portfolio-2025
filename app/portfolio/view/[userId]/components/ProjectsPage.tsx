import { notFound } from "next/navigation";
import PortfolioNavigation from "./PortfolioNavigation";
import { getPortfolioData } from "../page";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ProjectsPage({ params }: PageProps) {
  const { userId } = await params;
  const portfolioData = await getPortfolioData(userId);

  if (!portfolioData) {
    notFound();
  }

  const { profile, projects } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-slate-800">
      {/* Navigation */}
      <PortfolioNavigation userId={userId} userName={profile.name} />

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl mb-12 p-8 md:p-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-300 pb-3">
              Projects
            </h2>

            {projects.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No projects available.
              </p>
            ) : (
              <>
                {/* Featured Projects */}
                {projects.some((project) => project.featured) && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-6">
                      Featured Projects
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {projects
                        .filter((project) => project.featured)
                        .map((project) => (
                          <div
                            key={project._id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                          >
                            {project.imageUrl && (
                              <div className="relative h-64">
                                <img
                                  src={project.imageUrl}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                  <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Featured
                                  </span>
                                </div>
                              </div>
                            )}
                            <div className="p-6 flex-grow">
                              <h4 className="font-bold text-2xl text-sky-700 mb-2">
                                {project.title}
                              </h4>
                              <p className="text-slate-600 mb-4">
                                {project.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-slate-100 flex justify-between">
                              {project.projectUrl && (
                                <a
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:text-sky-800 font-semibold transition-colors duration-300 flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-4 h-4 mr-1.5"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                                      clipRule="evenodd"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.19a.75.75 0 00.053 1.06z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Live Demo
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-slate-700 font-semibold transition-colors duration-300 flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-4 h-4 mr-1.5"
                                  >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                  </svg>
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* All Projects */}
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-6">
                    All Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects
                      .filter((project) => !project.featured)
                      .map((project) => (
                        <div
                          key={project._id}
                          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                        >
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-5 flex-grow">
                            <h4 className="font-bold text-xl text-sky-700 mb-2">
                              {project.title}
                            </h4>
                            <p className="text-slate-600 mb-4 text-sm line-clamp-3">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.technologies
                                .slice(0, 3)
                                .map((tech, index) => (
                                  <span
                                    key={index}
                                    className="bg-sky-50 text-sky-700 text-xs px-2 py-0.5 rounded-full font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              {project.technologies.length > 3 && (
                                <span className="bg-slate-50 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                                  +{project.technologies.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 pt-0 border-t border-slate-100 flex justify-between">
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:text-sky-800 font-medium transition-colors duration-300 text-sm flex items-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-4 h-4 mr-1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                                    clipRule="evenodd"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.19a.75.75 0 00.053 1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-slate-700 font-medium transition-colors duration-300 text-sm flex items-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 mr-1"
                                >
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                Code
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400 hover:text-slate-200 transition-colors">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
