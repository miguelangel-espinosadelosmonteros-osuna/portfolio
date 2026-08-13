# Rotación de credenciales filtradas

El archivo `.env` se commiteó al repositorio. `.gitignore` solo ignoraba
`.env*.local`, así que `.env` nunca estuvo protegido.

Credenciales expuestas:

| Variable | Acción |
| --- | --- |
| `SPOTIFY_CLIENT_SECRET` | **Rotar** — da acceso completo a la app de Spotify |
| `SPOTIFY_REFRESH_TOKEN` | **Revocar** — permite leer tu biblioteca y playlists |
| `SPOTIFY_CLIENT_ID` | No es secreto, pero cambia al recrear la app |
| `VERCEL_OIDC_TOKEN` | Token de corta duración; ya caducó, no requiere acción |

> Reescribir el historial **no** invalida nada: hay que asumir que las claves
> ya fueron copiadas. La rotación es obligatoria y va primero.

---

## Paso 1 — Rotar las credenciales de Spotify (haz esto ya)

1. Entra en <https://developer.spotify.com/dashboard> y abre tu app.
2. **Settings → Rotate client secret**. Copia el nuevo valor.
3. El refresh token antiguo queda invalidado al rotar el secret.
4. Verifica que el **Redirect URI** registrado incluya:
   - `http://127.0.0.1:3000/api/spotify-callback` (desarrollo)
   - `https://TU-DOMINIO/api/spotify-callback` (producción)

## Paso 2 — Generar un refresh token nuevo

```bash
cp .env.example .env.local     # rellena CLIENT_ID, CLIENT_SECRET y REDIRECT_URI
npm run dev
```

Abre <http://127.0.0.1:3000/api/spotify-auth>, autoriza, y copia el
`refreshToken` que devuelve el callback en `SPOTIFY_REFRESH_TOKEN`.

Ambas rutas (`/api/spotify-auth` y `/api/spotify-callback`) devuelven 404 en
producción: son utilidades de desarrollo.

## Paso 3 — Actualizar Vercel

```bash
vercel env rm SPOTIFY_CLIENT_SECRET production
vercel env add SPOTIFY_CLIENT_SECRET production
vercel env rm SPOTIFY_REFRESH_TOKEN production
vercel env add SPOTIFY_REFRESH_TOKEN production
vercel --prod            # redeploy para que tomen efecto
```

Repite para los entornos `preview` y `development` si los usas.

## Paso 4 — Sacar `.env` del repositorio

`.gitignore` ya está corregido. Ahora quita el archivo del índice sin borrarlo
de tu disco:

```bash
git rm --cached .env
git add .gitignore .env.example
git commit -m "chore: dejar de trackear .env y añadir .env.example"
git push
```

## Paso 5 — Purgar `.env` del historial

Solo tiene sentido después del Paso 1. Reduce la exposición a escáneres
automáticos, pero no recupera las claves.

Con [`git-filter-repo`](https://github.com/newren/git-filter-repo)
(recomendado, `brew install git-filter-repo`):

```bash
# Trabaja sobre un clon fresco, no sobre tu copia de trabajo
git clone --mirror https://github.com/TU-USUARIO/portfolio.git portfolio-limpio
cd portfolio-limpio
git filter-repo --invert-paths --path .env
git push --force --all
git push --force --tags
```

Después de esto:

- Avisa a cualquier colaborador: deben reclonar, no hacer `pull`.
- Los forks y las caché de GitHub **conservan** los blobs antiguos. Pide a
  GitHub Support que purgue la caché si el repo es público, o considera
  hacerlo privado.

## Paso 6 — Comprobación

```bash
git log --all --oneline -- .env        # no debe devolver nada
git check-ignore -v .env               # debe indicar la regla de .gitignore
```

Activa además **Settings → Code security → Secret scanning + Push protection**
en el repositorio de GitHub para que un futuro `.env` se bloquee al hacer push.
