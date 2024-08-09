import React from 'react';
import { Linkedin } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { Mail } from 'lucide-react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-purple-400 to-purple-600 min-h-screen flex flex-col items-center">
      <div className="text-white py-12 text-center text-5xl font-bold bg-purple-800/20 rounded-lg shadow-lg mb-12">
        Meet the Team
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12 px-4 w-full max-w-screen-xl mb-12">
        {[{
          initials: 'CM',
          name: 'Chris Miranda',
          role: 'Software Engineer',
          linkedin: 'https://www.linkedin.com/in/c-miranda1',
          github: 'https://github.com/ChrisCodeTrials',
          email: 'mailto:ChristopherMiranda@pursuit.org'
        }, {
          initials: 'MR',
          name: 'Michael Restrepoross',
          role: 'Software Engineer',
          linkedin: 'http://www.linkedin.com/in/michael-restrepoross',
          github: 'https://github.com/MichaelARestrepoross',
          email: 'mailto:MichaelRestrepoross@pursuit.org'
        }, {
          initials: 'JB',
          name: 'Jose Barrios',
          role: 'Software Engineer',
          linkedin: 'https://www.linkedin.com/in/josebarriosa/',
          github: 'https://github.com/josebarrios23',
          email: 'mailto:JoseBarrios@pursuit.org'
        }].map((member, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-500 text-white rounded-full h-24 w-24 flex items-center justify-center text-4xl font-bold mb-4">
                {member.initials}
              </div>
              <div className="text-xl font-semibold mb-2">{member.name}</div>
              <div className="text-gray-600 mb-4">{member.role}</div>
              <div className="flex justify-center space-x-4">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors">
                  <Linkedin className="text-white w-6 h-6" />
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-800 hover:bg-gray-900 transition-colors">
                  <FiGithub className="text-white w-6 h-6" />
                </a>
                <a href={member.email} className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition-colors">
                  <Mail className="text-white w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
