import zipfile
import os

def main():
    template = "FICHA_FUNCIONAL_TEMPLATE.xlsx" # Confirme se o nome é exatamente esse
    
    if not os.path.exists(template):
        # Tenta achar na pasta utils se não estiver na raiz
        template = "utils/FICHA_FUNCIONAL_TEMPLATE.xlsx"
    
    if not os.path.exists(template):
        print(f"❌ Erro: Não encontrei o arquivo {template}")
        return

    print(f"Procurando imagens dentro de {template}...")
    
    # O arquivo Excel (.xlsx) é na verdade um arquivo ZIP disfarçado
    with zipfile.ZipFile(template, 'r') as z:
        encontrou = False
        for file_info in z.infolist():
            # As imagens geralmente ficam na pasta 'xl/media/'
            if "xl/media/" in file_info.filename:
                ext = file_info.filename.split('.')[-1]
                nome_saida = f"logo_governo.{ext}"
                
                with open(nome_saida, "wb") as f:
                    f.write(z.read(file_info))
                
                print(f"✅ Imagem extraída com sucesso: {nome_saida}")
                encontrou = True
        
        if not encontrou:
            print("❌ Nenhuma imagem encontrada dentro deste Excel.")

if __name__ == "__main__":
    main()