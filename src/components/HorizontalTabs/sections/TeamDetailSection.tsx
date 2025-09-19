"use client";

import React from 'react';
import Image from 'next/image';
import { ImageMedia } from "@/utils/types";

interface Trabalhador {
  nome: string;
  cargo?: string;
  image?: ImageMedia;
}

interface Equipa {
  titulo: string;
  id_name: string;
  trabalhador: Trabalhador[];
}

interface Producao {
  titulo: string;
  id_name: string;
  equipas?: Equipa[];
}

interface Projecto {
  titulo: string;
  id_name: string;
  equipas?: Equipa[];
}

interface Cargo {
  name: string;
  cargo?: string;
  image?: ImageMedia;
}

interface Chefia {
  titulo: string;
  cargos: Cargo[];
}

interface TeamDetailSectionProps {
  tabContent: {
    grafico?: ImageMedia;
    producao?: Producao[];
    projecto?: Projecto[];
    chefia?: Chefia;
    content?: string;
  };
  handleMouseEnter: (image: ImageMedia, name: string, e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleMouseMove: (e: React.MouseEvent) => void;
}

const TeamDetailSection: React.FC<TeamDetailSectionProps> = ({
  tabContent,
  handleMouseEnter,
  handleMouseLeave,
  handleMouseMove
}) => {
  return (
    <div 
      className="relative w-full 
        2xl:text-teams-1400
        3xl:text-teams-1600
        4xl:text-teams-1920
        5xl:text-teams-2000
        leading-snug gap-10 h-full md:h-[75vh] py-4 mt-[10vh] md:mt-0 columns-1 md:columns-3 justify-start" 
      style={{ columnFill: "auto" }}
    >
      {/* Render grafico as an image if present */}
      {tabContent.grafico && tabContent.grafico.url && (
        <div className="w-1/2 pb-8">
          <Image
            src={tabContent.grafico.url}
            alt={tabContent.grafico.alt || "Gráfico"}
            width={tabContent.grafico.width || 200}
            height={tabContent.grafico.height || 200}
            className="object-contain"
          />
        </div>
      )}

      {/* Render producao legenda */}
      {tabContent.producao && tabContent.producao.length > 0 && (
        <div className="pb-8 text-rodape leading-tight">
          <ul>
            {tabContent.producao.map((prod, idx) => (
              <div key={idx}>
                {prod.equipas && prod.equipas.length > 0 && (
                  <ul>
                    <li key="idx" className="gap-4 flex">
                      <span className="w-[1em] font-mono">{prod.id_name}</span>
                      <span className="lowercase font-mono">{"[" + prod.titulo + "]"}</span>
                    </li>
                    {prod.equipas.map((e, eidx) => (
                      <li key={eidx} className="gap-4 flex">
                        <span className="w-[1em] font-mono">{e.id_name}</span>
                        <span className="lowercase font-mono">{"[" + e.titulo + "]"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            
            {tabContent.projecto && tabContent.projecto.map((prod, idx) => (
              <div key={idx}>
                {prod.equipas && prod.equipas.length > 0 && (
                  <ul>
                    <li key="idx" className="gap-4 flex">
                      <span className="w-[1em] font-mono">{prod.id_name}</span>
                      <span className="lowercase font-mono">{"[" + prod.titulo + "]"}</span>
                    </li>
                    {prod.equipas.map((e, eidx) => (
                      <li key={eidx} className="gap-4 flex">
                        <span className="w-[1em] font-mono">{e.id_name}</span>
                        <span className="lowercase font-mono font-bold">{"[" + e.titulo + "]"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}

      {/* Render chefia/direccao */}
      {tabContent.chefia && tabContent.chefia.cargos && tabContent.chefia.cargos.length > 0 && (
        <div className="pb-4">
          <h3 className="uppercase">{tabContent.chefia.titulo}</h3>
          <ul>
            {tabContent.chefia.cargos.map((member, idx) => (
              <li key={idx}>
                <span
                  className={`${member.image?.url ? 'cursor-pointer' : ''}`}
                  onMouseEnter={member.image?.url ? (e) => handleMouseEnter(member.image!, member.name, e) : undefined}
                  onMouseLeave={member.image?.url ? handleMouseLeave : undefined}
                  onMouseMove={member.image?.url ? handleMouseMove : undefined}
                >
                  <span className="font-works">{member.name}</span>{member.cargo && `, ${member.cargo}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render producao teams */}
      {tabContent.producao && tabContent.producao.length > 0 && (
        <div className="">
          {tabContent.producao.map((prod, idx) => (
            <div key={idx}>
              <h3 className="uppercase">
                {prod.titulo} <sup className="font-mono text-teams">{prod.id_name}</sup>
              </h3>
              <div>
                {prod.equipas && prod.equipas.length > 0 && (
                  <ul>
                    {prod.equipas.map((e, eidx) => (
                      <li key={eidx} className="pb-4">
                        <h3>
                          {e.titulo} <sup className="font-mono text-teams">{e.id_name}</sup>
                        </h3>
                        <ul>
                          {e.trabalhador.map((t, tidx) => (
                            <li key={tidx}>
                              <span
                                className={`${t.image?.url ? 'cursor-pointer transition-colors' : ''}`}
                                onMouseEnter={t.image?.url ? (e) => handleMouseEnter(t.image!, t.nome, e) : undefined}
                                onMouseLeave={t.image?.url ? handleMouseLeave : undefined}
                                onMouseMove={t.image?.url ? handleMouseMove : undefined}
                              >
                                {t.nome}<span className="font-works">{t.cargo && `, ${t.cargo}`}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render projecto teams */}
      {tabContent.projecto && tabContent.projecto.length > 0 && (
        <div className="pb-4">
          {tabContent.projecto.map((proj, idx) => (
            <div key={idx}>
              <h3 className="uppercase">
                {proj.titulo} <sup className="font-mono text-teams">{proj.id_name}</sup>
              </h3>
              <div key={proj.id_name + idx}>
                {proj.equipas && proj.equipas.length > 0 && (
                  <ul>
                    {proj.equipas.map((e, eidx) => (
                      <li key={eidx} className="pb-4">
                        <h3>
                          {e.titulo} <sup className="font-mono text-teams">{e.id_name}</sup>
                        </h3>
                        <ul>
                          {e.trabalhador.map((t, tidx) => (
                            <li key={tidx}>
                              <span
                                className={`${t.image?.url ? 'cursor-pointer transition-colors' : ''}`}
                                onMouseEnter={t.image?.url ? (e) => handleMouseEnter(t.image!, t.nome, e) : undefined}
                                onMouseLeave={t.image?.url ? handleMouseLeave : undefined}
                                onMouseMove={t.image?.url ? handleMouseMove : undefined}
                              >
                                {t.nome}<span className="font-works">{t.cargo && `, ${t.cargo}`}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render content if it exists */}
      {tabContent.content && (
        <div
          className="flex flex-col w-full max-h-full leading-tight font-works md:w-full"
          dangerouslySetInnerHTML={{ __html: tabContent.content }}
        />
      )}
    </div>
  );
};

export default TeamDetailSection;