import { notFound } from "next/navigation";
import dbConnect from "../../../../lib/db";
import {
  PortfolioProfile,
  Project,
  Skill,
  Experience,
  IPortfolioProfile,
  IProject,
  ISkill,
  IExperience,
} from "../../../../lib/models/Portfolio";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

interface PortfolioData {
  profile: IPortfolioProfile;
  projects: IProject[];
  skills: ISkill[];
  experiences: IExperience[];
}

async function getPortfolioData(userId: string): Promise<PortfolioData | null> {
  try {
    await dbConnect();

    const profile = await PortfolioProfile.findOne({
      userId,
      isPublic: true,
    }).lean();

    if (!profile) {
      return null;
    }

    const [projects, skills, experiences] = await Promise.all([
      Project.find({ userId })
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .lean(),
      Skill.find({ userId }).sort({ category: 1, order: 1 }).lean(),
      Experience.find({ userId }).sort({ startDate: -1 }).lean(),
    ]);

    // Cast the MongoDB documents to our interfaces
    return {
      profile: profile as unknown as IPortfolioProfile,
      projects: projects as unknown as IProject[],
      skills: skills as unknown as ISkill[],
      experiences: experiences as unknown as IExperience[],
    };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return null;
  }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  // Await the params Promise to get the userId
  const { userId } = await params;
  const portfolioData = await getPortfolioData(userId);

  if (!portfolioData) {
    notFound();
  }

  const { profile, projects, skills, experiences } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 text-slate-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
                {profile.name}
              </span>
            </h1>
            <div className="flex space-x-6">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-sky-600 transition-colors duration-300 font-medium text-lg"
                >
                  LinkedIn
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium text-lg"
                >
                  GitHub
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-purple-600 transition-colors duration-300 font-medium text-lg"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Section */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl mb-12 p-8 md:p-10 transform transition-all duration-500 hover:scale-[1.01]">
            <div className="md:flex items-center space-x-0 md:space-x-8">
              {profile.profileImage && (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-indigo-300 ring-offset-4 ring-offset-white shadow-lg mx-auto md:mx-0 mb-6 md:mb-0"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1">
                  {profile.title}
                </h2>
                {profile.location && (
                  <p className="text-slate-500 mt-2 text-lg flex items-center justify-center md:justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 mr-2 text-sky-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145l.002-.001l.207-.1.003-.001.002-.001-.114-.062a4.25 4.25 0 00-.97-.494l1.072-1.072a.5.5 0 00-.708-.708l-1.449 1.45a.25.25 0 01-.354 0l-1.45-1.45a.5.5 0 00-.707.708l1.072 1.072a4.25 4.25 0 00-.97.494l-.114.062l.002.001l.003.001.207.1.002.001a5.741 5.741 0 00.28.145l.019.008l.006.003l.002.001zm.31-1.713a5.873 5.873 0 00.421-.23l.006-.003.016-.007.018-.008.002-.001-.154-.085a3.25 3.25 0 01-1.022-.51l-.106-.054-.022-.011a.25.25 0 01.03-.44l1.874-1.873a.25.25 0 01.354 0l1.873 1.873a.25.25 0 01.03.44l-.022.011-.106.054a3.25 3.25 0 01-1.022.51l-.154.085l.002.001.018.008.016.007.006.003a5.872 5.872 0 00.42-.23l.003.002c.24.11.47.246.68.404l.004.003c.214.166.416.348.6.546l.003.003a1.5 1.5 0 01.323.373c.068.103.124.21.168.322l.002.003a.498.498 0 01.043.154l.002.006a1.07 1.07 0 01.02.191l.001.004c0 .024.004.047.004.071l-.001.006a.95.95 0 01-.012.158l-.001.002a.459.459 0 01-.022.102l-.003.005a.507.507 0 01-.034.099l-.002.003c-.019.038-.04.075-.064.11l-.004.006a1.642 1.642 0 01-.15.221l-.004.004a1.146 1.146 0 01-.132.16l-.002.002a.603.603 0 01-.065.071l-.005.004a.75.75 0 01-.22.195l-.003.002a2.003 2.003 0 01-.472.312l-.008.004a2.09 2.09 0 01-.291.15l-.004.001a.49.49 0 01-.112.038l-.004.001a.5.5 0 01-.596 0l-.004-.001a.49.49 0 01-.112-.038l-.004-.001a2.09 2.09 0 01-.291-.15l-.008-.004a2.003 2.003 0 01-.472-.312l-.003-.002a.75.75 0 01-.22-.195l-.005-.004a.602.602 0 01-.065-.071l-.002-.002a1.146 1.146 0 01-.132-.16l-.004-.004a1.643 1.643 0 01-.15-.221l-.004-.006c-.024-.035-.045-.072-.064-.11l-.002-.003a.507.507 0 01-.034-.099l-.003-.005a.46.46 0 01-.022-.102l-.001-.002a.95.95 0 01-.012-.158l-.001-.006c0-.024.004-.047.004-.071l.001-.004a1.07 1.07 0 01.02-.191l.002-.006a.498.498 0 01.043-.154l.002-.003c.044-.112.1-.22.168-.322a1.5 1.5 0 01.323-.373l.003-.003c.184-.198.386-.38.6-.546l.004-.003c.21-.158.44-.294.68-.404l.003-.002z"
                        clipRule="evenodd"
                      />
                      <path d="M10 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    </svg>
                    {profile.location}
                  </p>
                )}
                <p className="text-slate-600 mt-6 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                  {profile.bio}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-block bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Contact Me
                  </a>
                  {profile.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-lg text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Download Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl mb-12 p-8 md:p-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-indigo-300 pb-3">
                Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {Object.entries(
                  skills.reduce((acc: any, skill: any) => {
                    if (!acc[skill.category]) {
                      acc[skill.category] = [];
                    }
                    acc[skill.category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, categorySkills]: [string, any]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-sky-700 mb-4 text-xl">
                      {category}
                    </h4>
                    <div className="space-y-3">
                      {categorySkills.map((skill: any) => (
                        <div key={skill._id} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-md text-slate-700 group-hover:text-indigo-600 transition-colors">
                              {skill.name}
                            </span>
                            <div className="flex space-x-1.5">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    level <= skill.level
                                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 group-hover:scale-110"
                                      : "bg-slate-300 group-hover:bg-slate-400"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 dark:bg-slate-700">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500 group-hover:opacity-80"
                              style={{ width: `${skill.level * 20}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl mb-12 p-8 md:p-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-indigo-300 pb-3">
                Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: any) => (
                  <div
                    key={project._id}
                    className="bg-slate-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-56 object-cover"
                      />
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-xl text-sky-700 hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h4>
                        {project.featured && (
                          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map(
                          (tech: string, index: number) => (
                            <span
                              key={index}
                              className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full font-medium"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>

                      <div className="mt-auto flex space-x-4 pt-2 border-t border-slate-200">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 text-sm font-semibold transition-colors duration-300 flex items-center"
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
                            className="text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors duration-300 flex items-center"
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experiences.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-8 md:p-10">
              <h3 className="text-3xl font-bold text-slate-800 mb-8 border-b-2 border-indigo-300 pb-3">
                Experience
              </h3>
              <div className="space-y-10">
                {experiences.map((exp: any, index: number) => (
                  <div key={exp._id} className="relative pl-8 py-4 group">
                    <div className="absolute left-0 top-5 w-0.5 h-full bg-sky-200 group-last:hidden"></div>
                    <div className="absolute left-[-0.375rem] top-[1.15rem] w-4 h-4 bg-sky-500 rounded-full border-4 border-white group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-sm"></div>

                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                      <div>
                        <h4 className="font-semibold text-xl text-slate-800 group-hover:text-indigo-700 transition-colors">
                          {exp.position}
                        </h4>
                        <p className="text-sky-600 font-semibold text-lg">
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p className="text-slate-500 text-sm mt-0.5">
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <p className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full inline-block">
                          {new Date(exp.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {exp.current
                            ? "Present"
                            : new Date(exp.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 mt-3 leading-relaxed text-base">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400 hover:text-slate-200 transition-colors">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Crafted with <span className="text-red-400">♥</span> and Tailwind
              CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
