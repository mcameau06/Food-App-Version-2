
"""
import ollama

client =  ollama.Client()

model = "llama3.2:3b"
query ="best pizza in boston"

prompt = f'Structure this query best for the google maps text search api with just 3 to 4 keywords,no preamble: {query}'

response = client.generate(model=model,prompt=prompt)


print(response.response)

"""
