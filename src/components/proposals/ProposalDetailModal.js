// src/components/proposals/ProposalDetailModal.jsx
import React from 'react';
import { FaTimes, FaDownload, FaEdit, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import styles from './ProposalDetailModal.module.css';

function htmlToText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

const ProposalDetailModal = ({ show, proposal, onClose }) => {
    const navigate = useNavigate();

    if (!show || !proposal) {
        return null;
    }

    const safeItensSelecionados = Array.isArray(proposal.itensSelecionados) ? proposal.itensSelecionados : [];

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        let yPos = 20; // Posição Y inicial
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Recuperar informações da empresa do localStorage (se existirem)
        const companyName = localStorage.getItem('sysConfig_companyName') || 'Sua Empresa';
        const companyCnpj = localStorage.getItem('sysConfig_companyCnpj') || 'XX.XXX.XXX/XXXX-XX';

        // --- Cabeçalho ---
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(companyName, margin, yPos);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`CNPJ: ${companyCnpj}`, margin, yPos + 6);
        yPos += 20;
        doc.line(margin, yPos, pageWidth - margin, yPos); // Linha separadora
        yPos += 10;

        // --- Título da Proposta ---
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(`PROPOSTA COMERCIAL`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Para: ${proposal.cliente}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 20;

        // --- Informações Gerais ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Informações da Proposta:", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.text(`Tipo: ${proposal.tipo}`, margin, yPos);
        doc.text(`Validade: ${proposal.validoPor}`, pageWidth / 2, yPos);
        yPos += 7;
        doc.text(`Data de Emissão: ${new Date(proposal.dataCriacao).toLocaleDateString()}`, margin, yPos);
        yPos += 7;
        doc.text(`Condições de Pagamento: ${proposal.condicoesPagamento}`, margin, yPos);
        yPos += 15;

        // --- Introdução ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Introdução:", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        const introText = htmlToText(proposal.introducao || '');
        const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
        doc.text(introLines, margin, yPos);
        yPos += (introLines.length * 6) + 10;

        // --- Itens da Proposta ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Itens da Proposta:", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");

        let totalValue = 0;
        safeItensSelecionados.forEach((item, i) => {
            const itemTitleLine = `${i + 1}. ${item.titulo} (Qtd: ${item.quantidade}) - R$ ${(item.valor || 0).toFixed(2)} cada`;
            doc.text(itemTitleLine, margin + 5, yPos);
            yPos += 7;
            
            if (item.descricao) {
                const itemDesc = `    ${item.descricao}`;
                const descLines = doc.splitTextToSize(itemDesc, pageWidth - 2 * margin - 10);
                doc.text(descLines, margin + 10, yPos);
                yPos += (descLines.length * 6);
            }

            if (item.estilo !== 'simples' && item.variaveis && item.variaveis.length > 0) {
                item.variaveis.forEach(variable => {
                    if (item.estilo === 'agrupado' && variable.defaultIncluded) {
                        const subItemText = `      - ${variable.name}: R$ ${(variable.value || 0).toFixed(2)}`;
                        doc.text(subItemText, margin + 15, yPos);
                        yPos += 7;
                        totalValue += (variable.value || 0);
                    } else if (item.estilo === 'detalhado') {
                        const detailText = `      - ${variable.name}: ${variable.value || variable.defaultValue}`;
                        doc.text(detailText, margin + 15, yPos);
                        yPos += 7;
                    }
                });
            }
            totalValue += item.quantidade * (item.valor || 0);
        });
        yPos += 5;
        doc.setFont("helvetica", "bold");
        doc.text(`Valor Total: R$ ${totalValue.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 15;

        // --- Modelo de Texto (Corpo Principal) ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Detalhes e Condições:", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        const modelText = htmlToText(proposal.modeloTexto || '');
        const modelLines = doc.splitTextToSize(modelText, pageWidth - 2 * margin);
        doc.text(modelLines, margin, yPos);
        yPos += (modelLines.length * 6) + 10;

        // --- Observações Finais ---
        if (proposal.descricao) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Observações:", margin, yPos);
            yPos += 7;
            doc.setFont("helvetica", "normal");
            const descLines = doc.splitTextToSize(proposal.descricao, pageWidth - 2 * margin);
            doc.text(descLines, margin, yPos);
            yPos += (descLines.length * 6) + 10;
        }

        // --- Rodapé (Número de página) ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        doc.save(`Proposta_${proposal.cliente}_${proposal.id}.pdf`);
    };

    const handleEditProposal = () => {
        onClose();
        navigate('/adicionar-proposta', { state: { proposalToEdit: proposal } });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Detalhes da Proposta para {proposal.cliente}</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalContent}>
                    <section className={styles.section}>
                        <strong>Status:</strong> <span className={`${styles.statusBadge} ${styles[proposal.status]}`}>{proposal.status?.toUpperCase() || 'N/A'}</span>
                    </section>
                    <section className={styles.section}>
                        <strong>Tipo:</strong> {proposal.tipo || 'N/A'}
                    </section>
                    <section className={styles.section}>
                        <strong>Data de Criação:</strong> {proposal.dataCriacao ? new Date(proposal.dataCriacao).toLocaleDateString() : 'N/A'}
                    </section>
                    <section className={styles.section}>
                        <strong>Validade:</strong> {proposal.validoPor || 'N/A'}
                    </section>
                    <section className={styles.section}>
                        <strong>Forma de Pagamento:</strong> {proposal.condicoesPagamento || 'N/A'}
                    </section>
                    {proposal.rejectionReason && (
                        <section className={styles.section}>
                            <strong>Motivo da Reprovação:</strong> {proposal.rejectionReason}
                        </section>
                    )}
                    <section className={styles.section}>
                        <strong>Introdução:</strong>
                        {proposal.introducao ? <div dangerouslySetInnerHTML={{ __html: proposal.introducao }} /> : <p className={styles.emptyContentText}>Nenhuma introdução.</p>}
                    </section>
                    <section className={styles.section}>
                        <strong>Modelo de Texto:</strong>
                        {proposal.modeloTexto ? <div dangerouslySetInnerHTML={{ __html: proposal.modeloTexto }} /> : <p className={styles.emptyContentText}>Nenhum modelo de texto.</p>}
                    </section>
                    <section className={styles.section}>
                        <strong>Observações:</strong>
                        <p className={styles.plainTextContent}>{proposal.descricao || 'Nenhuma observação.'}</p>
                    </section>
                    <section className={styles.section}>
                        <strong>Itens:</strong>
                        {safeItensSelecionados.length > 0 ? (
                            <ul className={styles.itensList}>
                                {safeItensSelecionados.map((item, idx) => (
                                    <li key={idx}>
                                        <div className={styles.itemDetailHeader}>
                                            <span className={styles.itemDetailTitle}>{item.titulo}</span>
                                            {item.estilo && (
                                                <span className={`${styles.estiloBadge} ${styles[item.estilo]}`}>
                                                    {item.estilo === 'agrupado' ? 'Agrupável' : item.estilo === 'detalhado' ? 'Detalhado' : 'Simples'}
                                                </span>
                                            )}
                                        </div>
                                        {item.descricao && <p className={styles.itemDescriptionText}>{item.descricao}</p>}
                                        
                                        {item.estilo !== 'simples' && item.variaveis && item.variaveis.length > 0 && (
                                            <div className={styles.itemDetailVariaveis}>
                                                <strong>Variáveis:</strong>
                                                <ul className={styles.itemDetailVariaveisList}>
                                                    {item.variaveis.map((v, i) => (
                                                        <li key={i}>
                                                            {v.name}: {
                                                                item.estilo === 'agrupado' 
                                                                    ? `${v.defaultIncluded ? 'Incluído' : 'Excluído'} - R$ ${(v.value || 0).toFixed(2)}`
                                                                    : `${v.value || v.defaultValue || 'N/A'} (Tipo: ${v.type})`
                                                            }
                                                        </li>
                                                    ))}
                                                </ul>
                                                {item.estilo === 'agrupado' && (
                                                  <p className={styles.agrupadoInfoModal}><FaInfoCircle /> O valor principal se refere ao grupo. Os sub-itens são informativos aqui.</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className={styles.itemDetailValues}>
                                            <span>Qtd: {item.quantidade}</span>
                                            <span>Valor: R$ **{(item.valor || 0).toFixed(2)}**</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.emptyContentText}>Nenhum item adicionado.</p>
                        )}
                    </section>
                    
                    {/* Seção de Histórico de Atividades */}
                    <section className={styles.section}>
                        <h3 className={styles.cardTitle}>Histórico de Atividades</h3>
                        {proposal.history && proposal.history.length > 0 ? (
                            <ul className={styles.historyList}>
                                {proposal.history.map((event, idx) => (
                                    <li key={idx} className={styles.historyItem}>
                                        <span className={styles.historyTimestamp}>
                                            {new Date(event.timestamp).toLocaleString('pt-BR')}
                                        </span>
                                        <span className={styles.historyType}>
                                            {event.type}
                                        </span>
                                        {event.from && event.to && (
                                            <span className={styles.historyDetails}>
                                                de "{event.from}" para "{event.to}"
                                            </span>
                                        )}
                                        {event.reason && (
                                            <span className={styles.historyDetails}>
                                                (Motivo: {event.reason})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.emptyContentText}>Nenhum histórico disponível.</p>
                        )}
                    </section>
                </div>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.closeButtonBottom}`}>Fechar</button>
                    <button onClick={handleDownloadPdf} className={`${styles.button} ${styles.downloadButton}`}>
                        <FaDownload /> Baixar PDF
                    </button>
                    <button onClick={handleEditProposal} className={`${styles.button} ${styles.editButton}`}>
                        <FaEdit /> Editar Proposta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProposalDetailModal;